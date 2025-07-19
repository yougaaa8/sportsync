from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
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
    permission_classes = [permissions.IsAuthenticated]


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
        # Assuming organizer is the user creating the event
        serializer.save()


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
