from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

from .models import Event, EventParticipant
from .serializers import EventListSerializer, EventDetailSerializer, EventSignUpSerializer, EventParticipantSerializer


class EventListView(generics.ListAPIView):
    """
    GET /api/event/list/
    List all active events
    """
    queryset = Event.objects.all()
    serializer_class = EventListSerializer


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
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event = get_object_or_404(Event, id=self.kwargs['pk'])
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
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Assuming organizer is the user creating the event
        serializer.save()
