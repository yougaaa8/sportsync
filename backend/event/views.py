from django.core import exceptions
from django.db import transaction
from rest_framework import generics, status
from cca.models import CCAMember
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from cloudinary.uploader import upload
from notifications.services import send_notification
from notifications.models import NotificationType
from .tasks import send_event_notification_task


from .models import Event, EventParticipant
from .serializers import EventListSerializer, EventDetailSerializer, EventSignUpSerializer, EventParticipantSerializer, PosterUploadSerializer


class EventListView(generics.ListAPIView):
    """
    GET /api/event/list/
    List all active events
    """
    queryset = Event.objects.all()
    serializer_class = EventListSerializer
    permission_classes = []


class EventDetailView(generics.RetrieveAPIView):
    """
    GET /api/event/{id}/
    Get detailed information about a specific event
    """
    queryset = Event.objects.all()
    serializer_class = EventDetailSerializer


class EventEditView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventDetailSerializer
    queryset = Event.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'pk'

    def get_object(self):
        obj = super().get_object()
        user = self.request.user

        # Allow access if user is the creator
        if user == obj.created_by:
            return obj

        # Allow access if user is in the admin list
        if obj.admins.filter(id=user.id).exists():
            return obj

        # If associated with a CCA, check committee membership
        cca = obj.cca
        if cca:
            try:
                member = CCAMember.objects.get(user=user, cca=cca)
                if member.position == 'committee':
                    return obj
                raise exceptions.PermissionDenied(
                    "Only committee members can edit events.")
            except CCAMember.DoesNotExist:
                raise exceptions.PermissionDenied(
                    "You are not a member of this CCA.")
        else:
            raise exceptions.PermissionDenied(
                "You do not have permission to edit this event.")

        return obj


class EventSignUpView(generics.CreateAPIView):
    """
    POST /api/event/{id}/signup/
    Sign up for an event
    """
    serializer_class = EventSignUpSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        event = get_object_or_404(Event, id=self.kwargs['pk'])
        context['event'] = event
        return context

    def perform_create(self, serializer):
        event = self.get_serializer_context()['event']

        if EventParticipant.objects.filter(event=event, user=self.request.user).exists():
            raise serializers.ValidationError(
                "Already registered for this event")

        if event.is_full:
            participant_status = 'waitlisted'
            notification_message = f"You have been waitlisted for {event.name} on {event.date} at {event.location}."
        else:
            participant_status = 'registered'
            notification_message = f"You have successfully registered for {event.name} on {event.date} at {event.location}."

        participant = EventParticipant.objects.create(
            user=self.request.user,
            event=event,
            status=participant_status
        )

        send_notification(
            recipient=self.request.user,
            title=f"Event Registration - {event.name}",
            message=notification_message,
            notification_type=NotificationType.EVENT_UPDATE,
            related_object_id=event.id,
            related_object_type='event'
        )


class EventLeaveView(generics.DestroyAPIView):
    """
    DELETE /api/event/{id}/leave/
    Leave an event
    """

    def get_object(self):
        event = get_object_or_404(Event, id=self.kwargs['pk'])
        participant = get_object_or_404(
            EventParticipant, event=event, user=self.request.user)
        return participant

    def delete(self, request, *args, **kwargs):
        participant = self.get_object()
        event = participant.event

        with transaction.atomic():
            participant.delete()

            waitlisted = EventParticipant.objects.filter(
                event=event,
                status='waitlisted'
            ).order_by('registered_at').first()

            if waitlisted:
                waitlisted.status = 'registered'
                waitlisted.save()

                send_notification(
                    recipient=waitlisted.user,
                    title=f"Event Spot Available - {event.name}",
                    message=f"You have been moved from the waitlist to registered for {event.name} on {event.date} at {event.location}.",
                    notification_type=NotificationType.EVENT_UPDATE,
                    related_object_id=event.id,
                    related_object_type='event'
                )

        return Response({"detail": "Successfully left the event."}, status=status.HTTP_204_NO_CONTENT)


class EventParticipantListView(generics.ListAPIView):
    """
    GET /api/event/participants/
    List all participants of an event
    """
    serializer_class = EventParticipantSerializer

    def get_queryset(self):
        event = get_object_or_404(Event, id=self.kwargs['pk'])
        return EventParticipant.objects.filter(event=event).order_by('status', 'registered_at')

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class EventCreateView(generics.CreateAPIView):
    """
    POST /api/event/create/
    Create a new event
    """
    serializer_class = EventDetailSerializer

    def perform_create(self, serializer):
        event = serializer.save(created_by=self.request.user)

        if event.cca:
            send_event_notification_task.delay(
                event_id=event.id,
                notification_type='new_event'
            )


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_poster(request, pk):
    """
    POST /api/event/{pk}/upload-poster/
    Upload/update event poster to Cloudinary
    """
    event = get_object_or_404(Event, id=pk)
    user = request.user

    # Allow access if user is the creator
    if user == event.created_by:
        pass
    # Allow access if user is in the admin list
    elif event.admins.filter(id=user.id).exists():
        pass
    # If associated with a CCA, check committee membership
    elif event.cca:
        try:
            member = CCAMember.objects.get(user=user, cca=event.cca)
            if member.position != 'committee':
                return Response(
                    {'error': 'Only committee members can upload posters for CCA events'},
                    status=status.HTTP_403_FORBIDDEN
                )
        except CCAMember.DoesNotExist:
            return Response(
                {'error': 'You are not a member of this CCA'},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        return Response(
            {'error': 'You do not have permission to upload poster for this event'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = PosterUploadSerializer(data=request.data)

    if serializer.is_valid():
        try:
            image_file = serializer.validated_data['poster']

            if event.poster:
                event.delete_old_poster()
            public_id = f"{event.name.replace(' ', '_')}_poster"
            upload_result = upload(
                image_file,
                folder="sportsync/event_poster/",
                public_id=public_id,
                transformation=[
                    {'width': 600, 'height': 800, 'crop': 'fill', 'gravity': 'auto'},
                    {'quality': 'auto:good'},
                    {'fetch_format': 'auto'}
                ],
                overwrite=True,
                resource_type="image"
            )

            event.poster = upload_result['public_id']
            event.save()

            return Response({
                'message': 'Poster uploaded successfully',
                'poster_url': upload_result['secure_url'],
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Upload failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def notify_event_participants(request, pk):
    """
    POST /api/event/{pk}/notify-participants/
    Send custom notification to all event participants
    """
    event = get_object_or_404(Event, id=pk)
    user = request.user

    # Allow access if user is the creator
    if user == event.created_by:
        pass
    # Allow access if user is in the admin list
    elif event.admins.filter(id=user.id).exists():
        pass
    # If associated with a CCA, check committee membership
    elif event.cca:
        try:
            member = CCAMember.objects.get(user=user, cca=event.cca)
            if member.position != 'committee':
                return Response(
                    {"error": "Only committee members can send notifications for CCA events"},
                    status=status.HTTP_403_FORBIDDEN
                )
        except CCAMember.DoesNotExist:
            return Response(
                {"error": "You are not a member of this CCA"},
                status=status.HTTP_403_FORBIDDEN
            )
    else:
        return Response(
            {"error": "You do not have permission to send notifications for this event"},
            status=status.HTTP_403_FORBIDDEN
        )

    title = request.data.get('title', f'Update for {event.name}')
    message = request.data.get('message', '')

    if not message:
        return Response(
            {"error": "Message is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    participants = EventParticipant.objects.filter(event=event)
    count = 0

    for participant in participants:
        send_notification(
            recipient=participant.user,
            title=title,
            message=message,
            notification_type=NotificationType.EVENT_UPDATE,
            related_object_id=event.id,
            related_object_type='event'
        )
        count += 1

    return Response({
        "message": f"Notification sent to {count} participants",
        "count": count
    }, status=status.HTTP_200_OK)
