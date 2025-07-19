from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentSport, Team, TeamMember, Match
from .serializers import TournamentSerializer, TournamentSportSerializer, TeamSerializer, TeamMemberSerializer, MatchSerializer


class IsStaff(permissions.BasePermission):
    """
    Allows access only to staff members.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.status == "staff"


class TournamentListView(generics.ListAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = []


class TournamentCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSerializer


class TournamentEditView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'tournament_id'


class TournamentSportListView(generics.ListAPIView):
    serializer_class = TournamentSportSerializer
    permission_classes = []

    def get_queryset(self):
        tournament = get_object_or_404(
            Tournament, id=self.kwargs['tournament_id'])
        queryset = TournamentSport.objects.filter(tournament=tournament)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "No sports found for this tournament"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TournamentSportCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSportSerializer

    def perform_create(self, serializer):
        tournament_id = self.kwargs.get('tournament_id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer.save(tournament=tournament)


class TournamentSportEditView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSportSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'sport_id'

    def get_queryset(self):
        tournament = get_object_or_404(
            Tournament, id=self.kwargs['tournament_id'])
        queryset = TournamentSport.objects.filter(tournament=tournament)
        return queryset


class TeamListView(generics.ListAPIView):
    serializer_class = TeamSerializer
    permission_classes = []

    def get_queryset(self):
        tournament_sport = get_object_or_404(
            TournamentSport, id=self.kwargs['sport_id'])
        queryset = Team.objects.filter(tournament_sport=tournament_sport)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "No teams found for this tournament sport"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TeamCreateView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TeamSerializer

    def perform_create(self, serializer):
        sport_id = self.kwargs.get('sport_id')
        tournament_sport = get_object_or_404(TournamentSport, id=sport_id)
        serializer.save(tournament_sport=tournament_sport)


class TeamEditView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TeamSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'team_id'

    def get_queryset(self):
        tournament_sport = get_object_or_404(
            TournamentSport, id=self.kwargs['sport_id'])
        queryset = Team.objects.filter(
            tournament_sport=tournament_sport)
        return queryset


class TeamMemberListView(generics.ListAPIView):
    serializer_class = TeamMemberSerializer
    permission_classes = []

    def get_queryset(self):
        team = get_object_or_404(Team, id=self.kwargs['team_id'])
        queryset = TeamMember.objects.filter(team=team)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "No members found for this team"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MatchListView(generics.ListAPIView):
    serializer_class = MatchSerializer
    permission_classes = []

    def get_queryset(self):
        tournament_sport = get_object_or_404(
            TournamentSport, id=self.kwargs['sport_id'])
        queryset = Match.objects.filter(tournament_sport=tournament_sport)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "No matches found for this tournament sport"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
