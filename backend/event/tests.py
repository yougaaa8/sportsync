from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from decimal import Decimal
from datetime import timedelta

from .models import Event, EventParticipant
from .serializers import EventListSerializer, EventDetailSerializer, EventSignUpSerializer, EventParticipantSerializer

User = get_user_model()


class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.future_date = timezone.now() + timedelta(days=7)
        self.past_date = timezone.now() - timedelta(days=1)

    def test_event_creation(self):
        event = Event.objects.create(
            name='Test Event',
            date=self.future_date,
            registration_deadline=self.future_date - timedelta(days=1)
        )

        self.assertEqual(event.name, 'Test Event')
        self.assertEqual(event.registration_fee, Decimal('0.00'))
        self.assertTrue(event.is_public)
        self.assertEqual(str(event), 'Test Event')

    def test_event_with_all_fields(self):
        event = Event.objects.create(
            name='Complete Event',
            organizer='Test Organizer',
            description='Test Description',
            date=self.future_date,
            location='Test Location',
            registration_fee=Decimal('25.50'),
            registration_deadline=self.future_date - timedelta(days=1),
            is_public=False,
            contact_point='test@contact.com'
        )

        self.assertEqual(event.name, 'Complete Event')
        self.assertEqual(event.organizer, 'Test Organizer')
        self.assertEqual(event.description, 'Test Description')
        self.assertEqual(event.location, 'Test Location')
        self.assertEqual(event.registration_fee, Decimal('25.50'))
        self.assertFalse(event.is_public)
        self.assertEqual(event.contact_point, 'test@contact.com')


class EventParticipantModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='participant@example.com',
            password='testpass123',
            first_name='John',
            last_name='Doe'
        )
        self.future_date = timezone.now() + timedelta(days=7)

        self.free_event = Event.objects.create(
            name='Free Event',
            date=self.future_date,
            registration_deadline=self.future_date - timedelta(days=1),
            registration_fee=Decimal('0.00')
        )

        self.paid_event = Event.objects.create(
            name='Paid Event',
            date=self.future_date,
            registration_deadline=self.future_date - timedelta(days=1),
            registration_fee=Decimal('10.00')
        )

    def test_participant_creation_free_event(self):
        participant = EventParticipant.objects.create(
            event=self.free_event,
            user=self.user
        )

        self.assertTrue(participant.paid_registration_fee)
        self.assertEqual(str(participant), 'John Doe - Free Event')

    def test_participant_creation_paid_event(self):
        participant = EventParticipant.objects.create(
            event=self.paid_event,
            user=self.user
        )

        self.assertFalse(participant.paid_registration_fee)
        self.assertEqual(str(participant), 'John Doe - Paid Event')

    def test_participant_registered_at_auto_set(self):
        participant = EventParticipant.objects.create(
            event=self.free_event,
            user=self.user
        )

        self.assertIsNotNone(participant.registered_at)
        self.assertLessEqual(participant.registered_at, timezone.now())


class EventSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='serializer@example.com',
            password='testpass123'
        )
        self.future_date = timezone.now() + timedelta(days=7)

        self.event = Event.objects.create(
            name='Serializer Test Event',
            date=self.future_date,
            registration_deadline=self.future_date - timedelta(days=1),
            registration_fee=Decimal('15.00'),
            location='Test Location',
            organizer='Test Organizer'
        )

    def test_event_list_serializer(self):
        serializer = EventListSerializer(instance=self.event)
        expected_fields = ['id', 'name', 'date', 'cca',
                           'organizer', 'location', 'registration_fee', 'is_public']

        self.assertEqual(set(serializer.data.keys()), set(expected_fields))
        self.assertEqual(serializer.data['name'], 'Serializer Test Event')
        self.assertEqual(serializer.data['organizer'], 'Test Organizer')

    def test_event_detail_serializer(self):
        EventParticipant.objects.create(event=self.event, user=self.user)

        serializer = EventDetailSerializer(instance=self.event)

        self.assertIn('participants_count', serializer.data)
        self.assertEqual(serializer.data['participants_count'], 1)
        self.assertEqual(serializer.data['name'], 'Serializer Test Event')

    def test_event_signup_serializer_valid(self):
        data = {
            'event': self.event.id,
            'user': self.user.id
        }

        serializer = EventSignUpSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_event_signup_serializer_duplicate(self):
        EventParticipant.objects.create(event=self.event, user=self.user)

        data = {
            'event': self.event.id,
            'user': self.user.id
        }

        serializer = EventSignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)


class EventViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='view@example.com',
            password='testpass123',
            first_name='View',
            last_name='User'
        )
        self.future_date = timezone.now() + timedelta(days=7)

        self.event = Event.objects.create(
            name='View Test Event',
            date=self.future_date,
            registration_deadline=self.future_date - timedelta(days=1),
            registration_fee=Decimal('20.00'),
            location='API Test Location',
            description='Test Description'
        )

    def test_event_list_view(self):
        url = reverse('event-list')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'View Test Event')

    def test_event_detail_view_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('event-detail', kwargs={'pk': self.event.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'View Test Event')
        self.assertIn('participants_count', response.data)

    def test_event_detail_view_unauthenticated(self):
        url = reverse('event-detail', kwargs={'pk': self.event.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_event_signup_view(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('event-signup', kwargs={'pk': self.event.id})
        data = {
            'event': self.event.id,
            'user': self.user.id
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(EventParticipant.objects.filter(
            event=self.event, user=self.user
        ).exists())

    def test_event_signup_view_unauthenticated(self):
        url = reverse('event-signup', kwargs={'pk': self.event.id})
        data = {
            'event': self.event.id,
            'user': self.user.id
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_event_signup_view_duplicate(self):
        self.client.force_authenticate(user=self.user)
        EventParticipant.objects.create(event=self.event, user=self.user)

        url = reverse('event-signup', kwargs={'pk': self.event.id})
        data = {
            'event': self.event.id,
            'user': self.user.id
        }
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_event_leave_view(self):
        self.client.force_authenticate(user=self.user)
        EventParticipant.objects.create(event=self.event, user=self.user)

        url = reverse('event-leave', kwargs={'pk': self.event.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(EventParticipant.objects.filter(
            event=self.event, user=self.user
        ).exists())

    def test_event_leave_view_not_participant(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('event-leave', kwargs={'pk': self.event.id})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_event_participants_list_view(self):
        self.client.force_authenticate(user=self.user)
        participant = EventParticipant.objects.create(
            event=self.event, user=self.user)

        url = reverse('event-participant-list', kwargs={'pk': self.event.id})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], participant.id)

    def test_event_create_view(self):
        self.client.force_authenticate(user=self.user)

        data = {
            'name': 'New Event',
            'date': self.future_date.isoformat(),
            'registration_deadline': (self.future_date - timedelta(days=1)).isoformat(),
            'registration_fee': '30.00',
            'location': 'New Location',
            'description': 'New Description'
        }

        url = reverse('event-create')
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Event.objects.filter(name='New Event').exists())

    def test_event_create_view_unauthenticated(self):
        data = {
            'name': 'New Event',
            'date': self.future_date.isoformat(),
            'registration_deadline': (self.future_date - timedelta(days=1)).isoformat(),
        }

        url = reverse('event-create')
        response = self.client.post(url, data)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EventIntegrationTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(
            email='user1@example.com',
            password='testpass123',
            first_name='User',
            last_name='One'
        )
        self.user2 = User.objects.create_user(
            email='user2@example.com',
            password='testpass123',
            first_name='User',
            last_name='Two'
        )

    def test_complete_event_workflow(self):
        self.client.force_authenticate(user=self.user1)
        future_date = timezone.now() + timedelta(days=7)

        create_data = {
            'name': 'Integration Test Event',
            'date': future_date.isoformat(),
            'registration_deadline': (future_date - timedelta(days=1)).isoformat(),
            'registration_fee': '15.00',
            'location': 'Integration Test Location',
            'description': 'Integration Test Description'
        }

        create_response = self.client.post(
            reverse('event-create'), create_data)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        event_id = create_response.data['id']

        # User1 signs up
        data = {
            'event': event_id,
            'user': self.user1.id
        }
        signup_response = self.client.post(
            reverse('event-signup', kwargs={'pk': event_id}), data)
        self.assertEqual(signup_response.status_code, status.HTTP_201_CREATED)

        # User2 signs up
        self.client.force_authenticate(user=self.user2)
        data2 = {
            'event': event_id,
            'user': self.user2.id
        }
        signup_response2 = self.client.post(
            reverse('event-signup', kwargs={'pk': event_id}), data2)
        self.assertEqual(signup_response2.status_code, status.HTTP_201_CREATED)

        # Check participants
        participants_response = self.client.get(
            reverse('event-participant-list', kwargs={'pk': event_id}))
        self.assertEqual(participants_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(participants_response.data), 2)

        # User1 leaves
        self.client.force_authenticate(user=self.user1)
        leave_response = self.client.delete(
            reverse('event-leave', kwargs={'pk': event_id}))
        self.assertEqual(leave_response.status_code,
                         status.HTTP_204_NO_CONTENT)

        # Check participants again
        participants_response2 = self.client.get(
            reverse('event-participant-list', kwargs={'pk': event_id}))
        self.assertEqual(participants_response2.status_code,
                         status.HTTP_200_OK)
        self.assertEqual(len(participants_response2.data), 1)

    def test_event_detail_with_participants_count(self):
        self.client.force_authenticate(user=self.user1)
        future_date = timezone.now() + timedelta(days=7)

        event = Event.objects.create(
            name='Count Test Event',
            date=future_date,
            registration_deadline=future_date - timedelta(days=1),
            registration_fee=Decimal('0.00')
        )

        detail_response = self.client.get(
            reverse('event-detail', kwargs={'pk': event.id}))
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data['participants_count'], 0)

        EventParticipant.objects.create(event=event, user=self.user1)
        EventParticipant.objects.create(event=event, user=self.user2)

        detail_response2 = self.client.get(
            reverse('event-detail', kwargs={'pk': event.id}))
        self.assertEqual(detail_response2.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response2.data['participants_count'], 2)


class EventErrorHandlingTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='error@example.com',
            password='testpass123'
        )

    def test_signup_nonexistent_event(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('event-signup', kwargs={'pk': 100})
        data = {}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_leave_nonexistent_event(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('event-leave', kwargs={'pk': 99999})
        response = self.client.delete(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_participants_list_nonexistent_event(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('event-participant-list', kwargs={'pk': 99999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_event_detail_nonexistent_event(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('event-detail', kwargs={'pk': 99999})
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
