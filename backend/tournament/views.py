from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentSport, Team, TeamMember, Match
from .serializers import TournamentSerializer, TournamentSportSerializer, TeamSerializer, TeamMemberSerializer, MatchSerializer
# Create your views here.


class TournamentListView(generics.ListAPIView):
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer


class TournamentSportListView(generics.ListAPIView):
    serializer_class = TournamentSportSerializer

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


class TeamListView(generics.ListAPIView):
    serializer_class = TeamSerializer

    def get_queryset(self):
        tournament_sport = get_object_or_404(
            TournamentSport, id=self.kwargs['sport_id'])
        queryset = Team.objects.filter(tournamentsport=tournament_sport)
        return queryset

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
            return Response({"error": "No teams found for this tournament sport"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class TeamMemberListView(generics.ListAPIView):
    serializer_class = TeamMemberSerializer

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
