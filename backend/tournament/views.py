from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from .models import Tournament, TournamentSport, Team, TeamMember, Match
from .serializers import TournamentSerializer, TournamentSportSerializer, TeamSerializer, TeamMemberSerializer, MatchSerializer
from .tasks import send_tournament_announcement


class IsStaff(permissions.BasePermission):
    """
    Allows access only to staff members.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.status == "staff"


class TournamentListView(generics.ListAPIView):
    """
    GET /api/tournaments/list/
    Get all tournaments in the system
    """
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer
    permission_classes = []


class TournamentCreateView(generics.CreateAPIView):
    """
    POST /api/tournaments/create/
    Create a new tournament (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSerializer


class TournamentEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/tournaments/{tournament_id}/edit/
    PUT /api/tournaments/{tournament_id}/edit/
    DELETE /api/tournaments/{tournament_id}/edit/
    Retrieve, update, or delete a specific tournament (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSerializer
    queryset = Tournament.objects.all()
    lookup_field = 'id'
    lookup_url_kwarg = 'tournament_id'


class TournamentSportListView(generics.ListAPIView):
    """
    GET /api/tournaments/{tournament_id}/
    Get all sports for a specific tournament
    """
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
    """
    POST /api/tournaments/{tournament_id}/create/
    Create a new sport for a specific tournament (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TournamentSportSerializer

    def perform_create(self, serializer):
        tournament_id = self.kwargs.get('tournament_id')
        tournament = get_object_or_404(Tournament, id=tournament_id)
        serializer.save(tournament=tournament)


class TournamentSportEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/edit/
    PUT /api/tournaments/{tournament_id}/{sport_id}/edit/
    DELETE /api/tournaments/{tournament_id}/{sport_id}/edit/
    Retrieve, update, or delete a specific tournament sport (staff only)
    """
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
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/teams/
    Get all teams for a specific tournament sport
    """
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
    """
    POST /api/tournaments/{tournament_id}/{sport_id}/teams/create/
    Create a new team for a specific tournament sport (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TeamSerializer

    def perform_create(self, serializer):
        sport_id = self.kwargs.get('sport_id')
        tournament_sport = get_object_or_404(TournamentSport, id=sport_id)
        serializer.save(tournament_sport=tournament_sport)


class TeamEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/edit/
    PUT /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/edit/
    DELETE /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/edit/
    Retrieve, update, or delete a specific team (staff only)
    """
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
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/
    Get all members for a specific team
    """
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


class TeamMemberCreateView(generics.CreateAPIView):
    """
    POST /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/create/
    Create a new team member for a specific team (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TeamMemberSerializer

    def perform_create(self, serializer):
        team_id = self.kwargs.get('team_id')
        team = get_object_or_404(Team, id=team_id)
        serializer.save(team=team)


class TeamMemberEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/{team_member_id}/edit/
    PUT /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/{team_member_id}/edit/
    DELETE /api/tournaments/{tournament_id}/{sport_id}/teams/{team_id}/{team_member_id}/edit/
    Retrieve, update, or delete a specific team member (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = TeamMemberSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'team_member_id'

    def get_queryset(self):
        team = get_object_or_404(
            Team, id=self.kwargs['team_id'])
        queryset = TeamMember.objects.filter(
            team=team)
        return queryset


class MatchListView(generics.ListAPIView):
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/matches/
    Get all matches for a specific tournament sport
    """
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


class MatchCreateView(generics.CreateAPIView):
    """
    POST /api/tournaments/{tournament_id}/{sport_id}/matches/create/
    Create a new match for a specific tournament sport (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = MatchSerializer

    def perform_create(self, serializer):
        sport_id = self.kwargs.get('sport_id')
        tournament_sport = get_object_or_404(TournamentSport, id=sport_id)
        serializer.save(tournament_sport=tournament_sport)


class MatchEditView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/tournaments/{tournament_id}/{sport_id}/matches/{match_id}/edit/
    PUT /api/tournaments/{tournament_id}/{sport_id}/matches/{match_id}/edit/
    DELETE /api/tournaments/{tournament_id}/{sport_id}/matches/{match_id}/edit/
    Retrieve, update, or delete a specific match (staff only)
    """
    permission_classes = [permissions.IsAuthenticated, IsStaff]
    serializer_class = MatchSerializer
    lookup_field = 'id'
    lookup_url_kwarg = 'match_id'

    def get_queryset(self):
        tournament_sport = get_object_or_404(
            TournamentSport, id=self.kwargs['sport_id'])
        queryset = Match.objects.filter(
            tournament_sport=tournament_sport)
        return queryset


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsStaff])
def send_tournament_announcement_view(request, tournament_id):
    """
    POST /api/tournaments/{tournament_id}/announce/
    Send a custom announcement for a specific tournament to all users
    """
    tournament = get_object_or_404(Tournament, id=tournament_id)

    title = request.data.get(
        'title', f'Tournament Announcement: {tournament.name}')
    message = request.data.get('message', '')

    if not message:
        return Response({'error': 'Message is required'}, status=status.HTTP_400_BAD_REQUEST)

    task = send_tournament_announcement.delay(tournament_id, title, message)

    return Response({
        'success': True,
        'message': 'Tournament announcement sent successfully',
        'task_id': task.id
    })
