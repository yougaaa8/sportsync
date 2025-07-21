from django.core import exceptions
from rest_framework import generics, status
from cca.models import CCAMember
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from cloudinary.uploader import upload


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
        serializer.save(user=self.request.user, event=event)


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
        participant.delete()
        return Response({"detail": "Successfully left the event."}, status=status.HTTP_204_NO_CONTENT)


class EventParticipantListView(generics.ListAPIView):
    """
    GET /api/event/participants/
    List all participants of an event
    """
    serializer_class = EventParticipantSerializer

    def get_queryset(self):
        event = get_object_or_404(Event, id=self.kwargs['pk'])
        queryset = EventParticipant.objects.filter(event=event)
        return queryset

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
        serializer.save(created_by=self.request.user)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_poster(request, pk):
    """Upload/update event poster to Cloudinary"""
    event = get_object_or_404(Event, id=pk)
    serializer = PosterUploadSerializer(data=request.data)

    if serializer.is_valid():
        try:
            image_file = serializer.validated_data['poster']

            # Delete old poster if exists
            if event.poster:
                event.delete_old_poster()
            public_id = f"{event.name.replace(' ', '_')}_poster"
            # Upload new image to Cloudinary
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

            # Update user logo picture field
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
