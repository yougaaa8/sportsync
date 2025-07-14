from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, datetime
from .models import Tournament, TournamentSport, Team, TeamMember, Match
from .serializers import (
    TournamentSerializer,
    TournamentSportSerializer,
    TeamSerializer,
    TeamMemberSerializer,
    MatchSerializer
)

User = get_user_model()


class TournamentModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31),
            description="Test tournament description"
        )

    def test_tournament_creation(self):
        self.assertEqual(self.tournament.name, "Test Tournament")
        self.assertEqual(self.tournament.status, "upcoming")
        self.assertEqual(self.tournament.start_date, date(2024, 1, 1))
        self.assertEqual(self.tournament.end_date, date(2024, 1, 31))
        self.assertEqual(self.tournament.description,
                         "Test tournament description")

    def test_tournament_str_method(self):
        self.assertEqual(str(self.tournament), "Test Tournament")

    def test_tournament_status_choices(self):
        self.tournament.status = "ongoing"
        self.tournament.save()
        self.assertEqual(self.tournament.status, "ongoing")

        self.tournament.status = "completed"
        self.tournament.save()
        self.assertEqual(self.tournament.status, "completed")

    def test_tournament_unique_name(self):
        with self.assertRaises(Exception):
            Tournament.objects.create(
                name="Test Tournament",
                status="upcoming",
                start_date=date(2024, 2, 1),
                end_date=date(2024, 2, 28)
            )


class TournamentSportModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male",
            description="Male football tournament"
        )

    def test_tournament_sport_creation(self):
        self.assertEqual(self.tournament_sport.tournament, self.tournament)
        self.assertEqual(self.tournament_sport.sport, "Football")
        self.assertEqual(self.tournament_sport.gender, "male")
        self.assertEqual(self.tournament_sport.description,
                         "Male football tournament")

    def test_tournament_sport_str_method(self):
        expected_str = "Football M - Test Tournament"
        self.assertEqual(str(self.tournament_sport), expected_str)

    def test_tournament_sport_gender_choices(self):
        sport_female = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Basketball",
            gender="female"
        )
        self.assertEqual(sport_female.gender, "female")

        sport_coed = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Tennis",
            gender="coed"
        )
        self.assertEqual(sport_coed.gender, "coed")

    def test_tournament_sport_cascade_delete(self):
        sport_id = self.tournament_sport.id
        self.tournament.delete()
        self.assertFalse(TournamentSport.objects.filter(id=sport_id).exists())


class TeamModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team = Team.objects.create(
            name="Test Team",
            tournament_sport=self.tournament_sport,
            description="Test team description"
        )

    def test_team_creation(self):
        self.assertEqual(self.team.name, "Test Team")
        self.assertEqual(self.team.tournament_sport, self.tournament_sport)
        self.assertEqual(self.team.description, "Test team description")

    def test_team_str_method(self):
        expected_str = "Test Team Football M team - Test Tournament"
        self.assertEqual(str(self.team), expected_str)

    def test_team_cascade_delete(self):
        team_id = self.team.id
        self.tournament_sport.delete()
        self.assertFalse(Team.objects.filter(id=team_id).exists())


class TeamMemberModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team = Team.objects.create(
            name="Test Team",
            tournament_sport=self.tournament_sport
        )
        self.team_member = TeamMember.objects.create(
            team=self.team,
            user=self.user,
            jersey_name="Test Player",
            jersey_number=10,
            role="Forward"
        )

    def test_team_member_creation(self):
        self.assertEqual(self.team_member.team, self.team)
        self.assertEqual(self.team_member.user, self.user)
        self.assertEqual(self.team_member.jersey_name, "Test Player")
        self.assertEqual(self.team_member.jersey_number, 10)
        self.assertEqual(self.team_member.role, "Forward")

    def test_team_member_str_method(self):
        expected_str = "Test Player 10 - Test Team"
        self.assertEqual(str(self.team_member), expected_str)

    def test_team_member_cascade_delete(self):
        member_id = self.team_member.id
        self.team.delete()
        self.assertFalse(TeamMember.objects.filter(id=member_id).exists())


class MatchModelTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team1 = Team.objects.create(
            name="Team A",
            tournament_sport=self.tournament_sport
        )
        self.team2 = Team.objects.create(
            name="Team B",
            tournament_sport=self.tournament_sport
        )
        self.match = Match.objects.create(
            tournament_sport=self.tournament_sport,
            team1=self.team1,
            team2=self.team2,
            round=1,
            date=timezone.make_aware(datetime(2024, 1, 15, 14, 30)),
            venue="Test Stadium",
            score_team1=2,
            score_team2=1,
            winner=self.team1,
            match_notes="Great match"
        )

    def test_match_creation(self):
        self.assertEqual(self.match.tournament_sport, self.tournament_sport)
        self.assertEqual(self.match.team1, self.team1)
        self.assertEqual(self.match.team2, self.team2)
        self.assertEqual(self.match.round, 1)
        self.assertEqual(self.match.venue, "Test Stadium")
        self.assertEqual(self.match.score_team1, 2)
        self.assertEqual(self.match.score_team2, 1)
        self.assertEqual(self.match.winner, self.team1)
        self.assertEqual(self.match.match_notes, "Great match")

    def test_match_str_method(self):
        expected_str = "Team A vs Team B - Test Tournament Football M Round 1"
        self.assertEqual(str(self.match), expected_str)

    def test_match_default_scores(self):
        new_match = Match.objects.create(
            tournament_sport=self.tournament_sport,
            team1=self.team1,
            team2=self.team2,
            round=2,
            date=timezone.make_aware(datetime(2024, 1, 20, 16, 0))
        )
        self.assertEqual(new_match.score_team1, 0)
        self.assertEqual(new_match.score_team2, 0)

    def test_match_cascade_delete(self):
        match_id = self.match.id
        self.tournament_sport.delete()
        self.assertFalse(Match.objects.filter(id=match_id).exists())


class TournamentSerializerTest(TestCase):
    def setUp(self):
        self.tournament_data = {
            'name': 'Test Tournament',
            'status': 'upcoming',
            'start_date': '2024-01-01',
            'end_date': '2024-01-31',
            'description': 'Test description'
        }

    def test_tournament_serializer_valid_data(self):
        serializer = TournamentSerializer(data=self.tournament_data)
        self.assertTrue(serializer.is_valid())

    def test_tournament_serializer_create(self):
        serializer = TournamentSerializer(data=self.tournament_data)
        self.assertTrue(serializer.is_valid())
        tournament = serializer.save()
        self.assertEqual(tournament.name, 'Test Tournament')
        self.assertEqual(tournament.status, 'upcoming')

    def test_tournament_serializer_missing_required_fields(self):
        incomplete_data = {'name': 'Test Tournament'}
        serializer = TournamentSerializer(data=incomplete_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('start_date', serializer.errors)
        self.assertIn('end_date', serializer.errors)


class TournamentSportSerializerTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.sport_data = {
            'tournament': self.tournament.id,
            'sport': 'Football',
            'gender': 'male',
            'description': 'Male football'
        }

    def test_tournament_sport_serializer_valid_data(self):
        serializer = TournamentSportSerializer(data=self.sport_data)
        self.assertTrue(serializer.is_valid())

    def test_tournament_sport_serializer_create(self):
        serializer = TournamentSportSerializer(data=self.sport_data)
        self.assertTrue(serializer.is_valid())
        sport = serializer.save()
        self.assertEqual(sport.sport, 'Football')
        self.assertEqual(sport.gender, 'male')


class TeamSerializerTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team_data = {
            'name': 'Test Team',
            'tournament_sport': self.tournament_sport.id,
            'description': 'Test team'
        }

    def test_team_serializer_valid_data(self):
        serializer = TeamSerializer(data=self.team_data)
        self.assertTrue(serializer.is_valid())

    def test_team_serializer_create(self):
        serializer = TeamSerializer(data=self.team_data)
        self.assertTrue(serializer.is_valid())
        team = serializer.save()
        self.assertEqual(team.name, 'Test Team')
        self.assertEqual(team.tournament_sport, self.tournament_sport)


class TeamMemberSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team = Team.objects.create(
            name="Test Team",
            tournament_sport=self.tournament_sport
        )
        self.member_data = {
            'team': self.team.id,
            'user': self.user.id,
            'jersey_name': 'Test Player',
            'jersey_number': 10,
            'role': 'Forward'
        }

    def test_team_member_serializer_valid_data(self):
        serializer = TeamMemberSerializer(data=self.member_data)
        self.assertTrue(serializer.is_valid())

    def test_team_member_serializer_create(self):
        serializer = TeamMemberSerializer(data=self.member_data)
        self.assertTrue(serializer.is_valid())
        member = serializer.save()
        self.assertEqual(member.jersey_name, 'Test Player')
        self.assertEqual(member.jersey_number, 10)


class MatchSerializerTest(TestCase):
    def setUp(self):
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team1 = Team.objects.create(
            name="Team A",
            tournament_sport=self.tournament_sport
        )
        self.team2 = Team.objects.create(
            name="Team B",
            tournament_sport=self.tournament_sport
        )
        self.match_data = {
            'tournament_sport': self.tournament_sport.id,
            'team1': self.team1.id,
            'team2': self.team2.id,
            'round': 1,
            'date': '2024-01-15T14:30:00Z',
            'venue': 'Test Stadium',
            'score_team1': 2,
            'score_team2': 1,
            'winner': self.team1.id,
            'match_notes': 'Great match'
        }

    def test_match_serializer_valid_data(self):
        serializer = MatchSerializer(data=self.match_data)
        self.assertTrue(serializer.is_valid())

    def test_match_serializer_create(self):
        serializer = MatchSerializer(data=self.match_data)
        self.assertTrue(serializer.is_valid())
        match = serializer.save()
        self.assertEqual(match.team1, self.team1)
        self.assertEqual(match.team2, self.team2)
        self.assertEqual(match.round, 1)


class TournamentAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.tournament1 = Tournament.objects.create(
            name="Tournament 1",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.tournament2 = Tournament.objects.create(
            name="Tournament 2",
            status="ongoing",
            start_date=date(2024, 2, 1),
            end_date=date(2024, 2, 28)
        )

    def test_tournament_list_view(self):
        url = reverse('tournament-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['name'], 'Tournament 1')
        self.assertEqual(response.data[1]['name'], 'Tournament 2')


class TournamentSportAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.sport1 = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.sport2 = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Basketball",
            gender="female"
        )

    def test_tournament_sport_list_view(self):
        url = reverse('tournament-sport_list',
                      kwargs={'tournament_id': self.tournament.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_tournament_sport_list_view_not_found(self):
        url = reverse('tournament-sport_list', kwargs={'tournament_id': 999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tournament_sport_list_view_empty(self):
        empty_tournament = Tournament.objects.create(
            name="Empty Tournament",
            status="upcoming",
            start_date=date(2024, 3, 1),
            end_date=date(2024, 3, 31)
        )
        url = reverse('tournament-sport_list',
                      kwargs={'tournament_id': empty_tournament.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'],
                         "No sports found for this tournament")


class TeamAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team1 = Team.objects.create(
            name="Team A",
            tournament_sport=self.sport
        )
        self.team2 = Team.objects.create(
            name="Team B",
            tournament_sport=self.sport
        )

    def test_team_list_view(self):
        url = reverse('team-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': self.sport.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_team_list_view_not_found(self):
        url = reverse('team-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': 999
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_team_list_view_empty(self):
        empty_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Tennis",
            gender="coed"
        )
        url = reverse('team-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': empty_sport.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'],
                         "No teams found for this tournament sport")


class TeamMemberAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team = Team.objects.create(
            name="Test Team",
            tournament_sport=self.sport
        )
        self.member = TeamMember.objects.create(
            team=self.team,
            user=self.user,
            jersey_name="Test Player",
            jersey_number=10,
            role="Forward"
        )

    def test_team_member_list_view(self):
        url = reverse('team-member-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': self.sport.id,
            'team_id': self.team.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['jersey_name'], 'Test Player')

    def test_team_member_list_view_not_found(self):
        url = reverse('team-member-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': self.sport.id,
            'team_id': 999
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_team_member_list_view_empty(self):
        empty_team = Team.objects.create(
            name="Empty Team",
            tournament_sport=self.sport
        )
        url = reverse('team-member-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': self.sport.id,
            'team_id': empty_team.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'],
                         "No members found for this team")


class MatchAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )
        self.client.force_authenticate(user=self.user)
        self.tournament = Tournament.objects.create(
            name="Test Tournament",
            status="upcoming",
            start_date=date(2024, 1, 1),
            end_date=date(2024, 1, 31)
        )
        self.sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Football",
            gender="male"
        )
        self.team1 = Team.objects.create(
            name="Team A",
            tournament_sport=self.sport
        )
        self.team2 = Team.objects.create(
            name="Team B",
            tournament_sport=self.sport
        )
        self.match = Match.objects.create(
            tournament_sport=self.sport,
            team1=self.team1,
            team2=self.team2,
            round=1,
            date=timezone.make_aware(datetime(2024, 1, 15, 14, 30)),
            venue="Test Stadium"
        )

    def test_match_list_view(self):
        url = reverse('match-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': self.sport.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_match_list_view_not_found(self):
        url = reverse('match-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': 999
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_match_list_view_empty(self):
        empty_sport = TournamentSport.objects.create(
            tournament=self.tournament,
            sport="Tennis",
            gender="coed"
        )
        url = reverse('match-list', kwargs={
            'tournament_id': self.tournament.id,
            'sport_id': empty_sport.id
        })
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(
            response.data['error'], "No matches found for this tournament sport")
