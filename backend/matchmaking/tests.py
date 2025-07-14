from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, time
from .models import Lobby, LobbyMember
from .serializers import LobbyListSerializer, LobbyDetailSerializer, LobbyMemberSerializer
from .views import IsLobbyMember

User = get_user_model()


class LobbyModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.lobby = Lobby.objects.create(
            name='Test Lobby',
            description='Test description',
            sport='Football',
            date=date.today(),
            start_time=time(10, 0),
            end_time=time(12, 0),
            location='Test Location',
            max_capacity=10
        )

    def test_lobby_creation(self):
        self.assertEqual(self.lobby.name, 'Test Lobby')
        self.assertEqual(self.lobby.sport, 'Football')
        self.assertEqual(self.lobby.max_capacity, 10)
        self.assertTrue(self.lobby.open_lobby)

    def test_lobby_str_representation(self):
        self.assertEqual(str(self.lobby), 'Test Lobby')

    def test_participant_count_empty(self):
        self.assertEqual(self.lobby.participant_count, 0)

    def test_participant_count_with_members(self):
        LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.assertEqual(self.lobby.participant_count, 1)

    def test_is_full_false(self):
        self.assertFalse(self.lobby.is_full)

    def test_is_full_true(self):
        for i in range(10):
            user = User.objects.create_user(
                email=f'user{i}@example.com',
                password='testpass123'
            )
            LobbyMember.objects.create(user=user, lobby=self.lobby)
        self.assertTrue(self.lobby.is_full)


class LobbyMemberModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.lobby = Lobby.objects.create(
            name='Test Lobby',
            sport='Football',
            date=date.today(),
            start_time=time(10, 0),
            location='Test Location'
        )
        self.member = LobbyMember.objects.create(
            user=self.user,
            lobby=self.lobby,
            status='admin'
        )

    def test_lobby_member_creation(self):
        self.assertEqual(self.member.user, self.user)
        self.assertEqual(self.member.lobby, self.lobby)
        self.assertEqual(self.member.status, 'admin')

    def test_lobby_member_str_representation(self):
        expected = f"{self.user.email} in {self.lobby.sport} game"
        self.assertEqual(str(self.member), expected)

    def test_default_status(self):
        member = LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.assertEqual(member.status, 'player')


class LobbySerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.lobby = Lobby.objects.create(
            name='Test Lobby',
            description='Test description',
            sport='Football',
            date=date.today(),
            start_time=time(10, 0),
            location='Test Location'
        )

    def test_lobby_list_serializer(self):
        serializer = LobbyListSerializer(self.lobby)
        data = serializer.data
        self.assertEqual(data['name'], 'Test Lobby')
        self.assertEqual(data['sport'], 'Football')
        self.assertIn('id', data)
        self.assertNotIn('password', data)

    def test_lobby_detail_serializer(self):
        serializer = LobbyDetailSerializer(self.lobby)
        data = serializer.data
        self.assertEqual(data['name'], 'Test Lobby')
        self.assertEqual(data['sport'], 'Football')
        self.assertIn('password', data)

    def test_lobby_member_serializer(self):
        member = LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        serializer = LobbyMemberSerializer(member)
        data = serializer.data
        self.assertEqual(data['first_name'], 'Test')
        self.assertEqual(data['last_name'], 'User')
        self.assertEqual(data['status'], 'player')


class IsLobbyMemberPermissionTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        self.lobby = Lobby.objects.create(
            name='Test Lobby',
            sport='Football',
            date=date.today(),
            start_time=time(10, 0),
            location='Test Location'
        )
        self.member = LobbyMember.objects.create(
            user=self.user,
            lobby=self.lobby
        )

    def test_has_permission_member(self):
        permission = IsLobbyMember()
        request = type('Request', (), {'user': self.user})()
        view = type('View', (), {'kwargs': {'id': self.lobby.id}})()

        self.assertTrue(permission.has_permission(request, view))

    def test_has_permission_non_member(self):
        permission = IsLobbyMember()
        request = type('Request', (), {'user': self.other_user})()
        view = type('View', (), {'kwargs': {'id': self.lobby.id}})()

        self.assertFalse(permission.has_permission(request, view))

    def test_has_permission_no_lobby_id(self):
        permission = IsLobbyMember()
        request = type('Request', (), {'user': self.user})()
        view = type('View', (), {'kwargs': {}})()

        self.assertFalse(permission.has_permission(request, view))


class LobbyViewsTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            email='admin@example.com',
            password='testpass123'
        )
        self.lobby = Lobby.objects.create(
            name='Test Lobby',
            sport='Football',
            date=date.today(),
            start_time=time(10, 0),
            location='Test Location'
        )
        self.admin_member = LobbyMember.objects.create(
            user=self.admin_user,
            lobby=self.lobby,
            status='admin'
        )
        self.client = APIClient()

    def test_lobby_list_view(self):
        url = reverse('lobby-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_lobby_create_view_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('lobby-create')
        data = {
            'name': 'New Lobby',
            'sport': 'Basketball',
            'date': date.today(),
            'start_time': time(14, 0),
            'location': 'New Location'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Lobby.objects.filter(name='New Lobby').exists())

    def test_lobby_create_view_unauthenticated(self):
        url = reverse('lobby-create')
        data = {
            'name': 'New Lobby',
            'sport': 'Basketball',
            'date': date.today(),
            'start_time': time(14, 0),
            'location': 'New Location'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_lobby_detail_view_member(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Lobby')

    def test_lobby_detail_view_non_member(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lobby_update_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        data = {'name': 'Updated Lobby'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_lobby_update_non_admin(self):
        member = LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.client.force_authenticate(user=self.user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        data = {'name': 'Updated Lobby'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lobby_delete_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Lobby.objects.filter(id=self.lobby.id).exists())

    def test_lobby_delete_non_admin(self):
        member = LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.client.force_authenticate(user=self.user)
        url = reverse('lobby-detail', kwargs={'id': self.lobby.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lobby_members_view_get(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-members', kwargs={'id': self.lobby.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_lobby_members_view_post_admin(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-members', kwargs={'id': self.lobby.id})
        data = {'user': self.user.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_lobby_members_view_post_player(self):
        player_member = LobbyMember.objects.create(
            user=self.user,
            lobby=self.lobby,
            status='player'
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('lobby-members', kwargs={'id': self.lobby.id})
        data = {'user': self.admin_user.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lobby_members_view_post_duplicate(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('lobby-members', kwargs={'id': self.lobby.id})
        data = {'user': self.admin_user.id}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_lobby_success(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('join-lobby', kwargs={'id': self.lobby.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(LobbyMember.objects.filter(
            user=self.user, lobby=self.lobby).exists())

    def test_join_lobby_already_member(self):
        LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.client.force_authenticate(user=self.user)
        url = reverse('join-lobby', kwargs={'id': self.lobby.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_join_lobby_full(self):
        self.lobby.max_capacity = 1
        self.lobby.save()
        self.client.force_authenticate(user=self.user)
        url = reverse('join-lobby', kwargs={'id': self.lobby.id})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_leave_lobby_success(self):
        LobbyMember.objects.create(user=self.user, lobby=self.lobby)
        self.client.force_authenticate(user=self.user)
        url = reverse('leave-lobby', kwargs={'id': self.lobby.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(LobbyMember.objects.filter(
            user=self.user, lobby=self.lobby).exists())

    def test_leave_lobby_not_member(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('leave-lobby', kwargs={'id': self.lobby.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_member_admin(self):
        member_to_delete = LobbyMember.objects.create(
            user=self.user, lobby=self.lobby)
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('delete-member', kwargs={
            'lobby_id': self.lobby.id,
            'user_id': self.user.id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(LobbyMember.objects.filter(
            id=member_to_delete.id).exists())

    def test_delete_member_non_admin(self):
        player_member = LobbyMember.objects.create(
            user=self.user, lobby=self.lobby, status='player')
        self.client.force_authenticate(user=self.user)
        url = reverse('delete-member', kwargs={
            'lobby_id': self.lobby.id,
            'user_id': self.admin_user.id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_member_self_removal(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('delete-member', kwargs={
            'lobby_id': self.lobby.id,
            'user_id': self.admin_user.id
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_member_nonexistent_user(self):
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('delete-member', kwargs={
            'lobby_id': self.lobby.id,
            'user_id': 9999
        })
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class LobbyIntegrationTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client = APIClient()

    def test_full_lobby_workflow(self):
        self.client.force_authenticate(user=self.user)

        create_url = reverse('lobby-create')
        lobby_data = {
            'name': 'Integration Test Lobby',
            'sport': 'Tennis',
            'date': date.today(),
            'start_time': time(15, 0),
            'location': 'Tennis Court'
        }
        create_response = self.client.post(create_url, lobby_data)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

        lobby_id = Lobby.objects.get(name='Integration Test Lobby').id

        detail_url = reverse('lobby-detail', kwargs={'id': lobby_id})
        detail_response = self.client.get(detail_url)
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)

        members_url = reverse('lobby-members', kwargs={'id': lobby_id})
        members_response = self.client.get(members_url)
        self.assertEqual(members_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(members_response.data), 1)

        update_response = self.client.patch(
            detail_url, {'name': 'Updated Lobby'})
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        delete_response = self.client.delete(detail_url)
        self.assertEqual(delete_response.status_code,
                         status.HTTP_204_NO_CONTENT)
        self.assertFalse(Lobby.objects.filter(id=lobby_id).exists())
