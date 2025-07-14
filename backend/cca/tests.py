from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, time
from .models import CCA, CCAMember, TrainingSession, Attendance
from .serializers import CCAListSerializer, CCADetailSerializer, CCAMemberSerializer, TrainingSessionSerializer, AttendanceSerializer

User = get_user_model()


class CCAModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test description',
            contact_email='test@cca.com',
            website='https://test.com'
        )

    def test_cca_creation(self):
        self.assertEqual(self.cca.name, 'Test CCA')
        self.assertEqual(self.cca.description, 'Test description')
        self.assertEqual(self.cca.contact_email, 'test@cca.com')

    def test_cca_str_method(self):
        self.assertEqual(str(self.cca), 'Test CCA')


class CCAMemberModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='member@example.com',
            password='testpass123',
            first_name='Member',
            last_name='User'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            position='member',
            role='Regular Member'
        )

    def test_cca_member_creation(self):
        self.assertEqual(self.member.user, self.user)
        self.assertEqual(self.member.cca, self.cca)
        self.assertEqual(self.member.position, 'member')
        self.assertTrue(self.member.is_active)

    def test_cca_member_str_method(self):
        expected = f"{self.user.email} {self.cca.name} membership status"
        self.assertEqual(str(self.member), expected)


class TrainingSessionModelTest(TestCase):
    def setUp(self):
        self.cca = CCA.objects.create(name='Test CCA')
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca
        )
        self.training_session = TrainingSession.objects.create(
            cca=self.cca,
            date=date.today(),
            start_time=time(14, 0),
            end_time=time(16, 0),
            location='Test Location',
            max_participants=20
        )

    def test_training_session_creation(self):
        self.assertEqual(self.training_session.cca, self.cca)
        self.assertEqual(self.training_session.location, 'Test Location')
        self.assertEqual(self.training_session.max_participants, 20)

    def test_participant_count_property(self):
        self.assertEqual(self.training_session.participant_count, 0)

        Attendance.objects.create(
            member=self.member,
            training_session=self.training_session,
            status='registered'
        )
        self.assertEqual(self.training_session.participant_count, 1)

    def test_is_full_property(self):
        self.assertFalse(self.training_session.is_full)


class AttendanceModelTest(TestCase):
    def setUp(self):
        self.cca = CCA.objects.create(name='Test CCA')
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca
        )
        self.training_session = TrainingSession.objects.create(
            cca=self.cca,
            date=date.today(),
            start_time=time(14, 0),
            end_time=time(16, 0),
            location='Test Location'
        )
        self.attendance = Attendance.objects.create(
            member=self.member,
            training_session=self.training_session,
            status='registered'
        )

    def test_attendance_creation(self):
        self.assertEqual(self.attendance.member, self.member)
        self.assertEqual(self.attendance.training_session,
                         self.training_session)
        self.assertEqual(self.attendance.status, 'registered')

    def test_attendance_str_method(self):
        expected = f"{self.user.get_full_name()} attendance for {self.training_session}"
        self.assertEqual(str(self.attendance), expected)


class CCASerializerTest(TestCase):
    def setUp(self):
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test description'
        )

    def test_cca_list_serializer(self):
        serializer = CCAListSerializer(self.cca)
        self.assertEqual(serializer.data['name'], 'Test CCA')
        self.assertEqual(serializer.data['description'], 'Test description')

    def test_cca_detail_serializer(self):
        serializer = CCADetailSerializer(self.cca)
        self.assertEqual(serializer.data['name'], 'Test CCA')


class CCAMemberSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            position='member'
        )

    def test_cca_member_serializer(self):
        serializer = CCAMemberSerializer(self.member)
        self.assertEqual(serializer.data['first_name'], 'Test')
        self.assertEqual(serializer.data['last_name'], 'User')
        self.assertEqual(serializer.data['position'], 'member')


class CCAListViewTest(APITestCase):
    def setUp(self):
        self.cca1 = CCA.objects.create(name='CCA 1')
        self.cca2 = CCA.objects.create(name='CCA 2')
        self.url = reverse('cca-list')

    def test_get_cca_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)


class CCADetailViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(
            name='Test CCA',
            description='Test description'
        )
        self.url = reverse('cca-detail', kwargs={'pk': self.cca.pk})

    def test_get_cca_detail_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test CCA')

    def test_get_cca_detail_unauthenticated(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CCAMembersViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.committee_user = User.objects.create_user(
            email='committee@example.com',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            position='member'
        )
        self.committee_member = CCAMember.objects.create(
            user=self.committee_user,
            cca=self.cca,
            position='committee'
        )
        self.url = reverse('cca-members', kwargs={'id': self.cca.id})

    def test_get_members_as_member(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_get_members_as_non_member(self):
        self.client.force_authenticate(user=self.other_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_add_member_as_committee(self):
        self.client.force_authenticate(user=self.committee_user)
        data = {
            'user': self.other_user.id,
            'position': 'member'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_member_as_regular_member(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'user': self.other_user.id,
            'position': 'member'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CCATrainingViewTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.committee_user = User.objects.create_user(
            email='committee@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            position='member'
        )
        self.committee_member = CCAMember.objects.create(
            user=self.committee_user,
            cca=self.cca,
            position='committee'
        )
        self.training_session = TrainingSession.objects.create(
            cca=self.cca,
            date=date.today(),
            start_time=time(14, 0),
            end_time=time(16, 0),
            location='Test Location'
        )
        self.url = reverse('cca-training', kwargs={'id': self.cca.id})

    def test_get_training_sessions(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_create_training_session_as_committee(self):
        self.client.force_authenticate(user=self.committee_user)
        data = {
            'date': '2023-12-01',
            'start_time': '14:00:00',
            'end_time': '16:00:00',
            'location': 'New Location',
            'max_participants': 25
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class JoinTrainingSessionTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.non_member = User.objects.create_user(
            email='nonmember@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            is_active=True
        )
        self.training_session = TrainingSession.objects.create(
            cca=self.cca,
            date=date.today(),
            start_time=time(14, 0),
            end_time=time(16, 0),
            location='Test Location',
            max_participants=5
        )
        self.url = reverse('join-training-session', kwargs={
            'cca_id': self.cca.id,
            'session_id': self.training_session.id
        })

    def test_join_training_session_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['status'], 'registered')

    def test_join_training_session_as_non_member(self):
        self.client.force_authenticate(user=self.non_member)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_join_training_session_already_registered(self):
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url)
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LeaveTrainingSessionTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.cca = CCA.objects.create(name='Test CCA')
        self.member = CCAMember.objects.create(
            user=self.user,
            cca=self.cca,
            is_active=True
        )
        self.training_session = TrainingSession.objects.create(
            cca=self.cca,
            date=date.today(),
            start_time=time(14, 0),
            end_time=time(16, 0),
            location='Test Location'
        )
        self.attendance = Attendance.objects.create(
            member=self.member,
            training_session=self.training_session,
            status='registered'
        )
        self.url = reverse('leave-training-session', kwargs={
            'cca_id': self.cca.id,
            'session_id': self.training_session.id
        })

    def test_leave_training_session_success(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(
            Attendance.objects.filter(
                member=self.member,
                training_session=self.training_session
            ).exists()
        )

    def test_leave_training_session_not_registered(self):
        self.attendance.delete()
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
