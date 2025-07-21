from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta

from .models import Event, EventParticipant
from cca.models import CCA, CCAMember

User = get_user_model()


class EventModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )

    def test_event_creation(self):
        event = Event.objects.create(
            name='Test Event',
            created_by=self.user,
            description='Test description',
            date=date.today() + timedelta(days=7),
            location='Test Location',
            registration_deadline=date.today() + timedelta(days=5)
        )
        self.assertEqual(str(event), 'Test Event')
        self.assertEqual(event.created_by, self.user)
        self.assertTrue(event.is_public)

    def test_event_with_cca(self):
        cca = CCA.objects.create(name='Test CCA')
        event = Event.objects.create(
            name='CCA Event',
            cca=cca,
            created_by=self.user,
            date=date.today() + timedelta(days=7),
            registration_deadline=date.today() + timedelta(days=5)
        )
        self.assertEqual(event.cca, cca)


class EventParticipantModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.event = Event.objects.create(
            name='Test Event',
            created_by=self.user,
            date=date.today() + timedelta(days=7),
            registration_deadline=date.today() + timedelta(days=5)
        )

    def test_participant_creation(self):
        participant = EventParticipant.objects.create(
            event=self.event,
            user=self.user
        )
        self.assertEqual(participant.event, self.event)
        self.assertEqual(participant.user, self.user)
        self.assertIsNotNone(participant.registered_at)


class EventAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        self.other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass123',
            first_name='Other',
            last_name='User'
        )
        self.event = Event.objects.create(
            name='Test Event',
            created_by=self.user,
            description='Test description',
            date=date.today() + timedelta(days=7),
            location='Test Location',
            registration_deadline=date.today() + timedelta(days=5)
        )

    def test_event_list_view(self):
        url = reverse('event-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_event_detail_view(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('event-detail', kwargs={'pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Event')

    def test_event_create_authenticated(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('event-create')
        data = {
            'name': 'New Event',
            'description': 'New description',
            'date': date.today() + timedelta(days=10),
            'location': 'New Location',
            'registration_deadline': date.today() + timedelta(days=8)
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Event.objects.count(), 2)

    def test_event_signup(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-signup', kwargs={'pk': self.event.pk})
        data = {'event': self.event.pk, 'user': self.other_user.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            EventParticipant.objects.filter(
                event=self.event, user=self.other_user
            ).exists()
        )

    def test_event_signup_duplicate(self):
        EventParticipant.objects.create(event=self.event, user=self.other_user)
        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-signup', kwargs={'pk': self.event.pk})
        data = {'event': self.event.pk, 'user': self.other_user.pk}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_event_leave(self):
        EventParticipant.objects.create(event=self.event, user=self.other_user)
        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-leave', kwargs={'pk': self.event.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            EventParticipant.objects.filter(
                event=self.event, user=self.other_user
            ).exists()
        )

    def test_event_participants_list(self):
        EventParticipant.objects.create(event=self.event, user=self.other_user)
        self.client.force_authenticate(user=self.user)
        url = reverse('event-participant-list', kwargs={'pk': self.event.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_event_edit_by_creator(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('event-edit', kwargs={'pk': self.event.pk})
        data = {'name': 'Updated Event'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.event.refresh_from_db()
        self.assertEqual(self.event.name, 'Updated Event')

    def test_event_edit_permission_denied(self):
        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-edit', kwargs={'pk': self.event.pk})
        data = {'name': 'Updated Event'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_event_edit_by_admin(self):
        self.event.admins.add(self.other_user)
        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-edit', kwargs={'pk': self.event.pk})
        data = {'name': 'Updated by Admin'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_event_edit_by_cca_committee(self):
        cca = CCA.objects.create(name='Test CCA')
        self.event.cca = cca
        self.event.save()

        CCAMember.objects.create(
            user=self.other_user,
            cca=cca,
            position='committee'
        )

        self.client.force_authenticate(user=self.other_user)
        url = reverse('event-edit', kwargs={'pk': self.event.pk})
        data = {'name': 'Updated by Committee'}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
