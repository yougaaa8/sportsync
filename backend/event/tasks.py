from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from notifications.services import send_notification
from notifications.models import NotificationType
from .models import Event, EventParticipant
from cca.models import CCAMember


@shared_task
def send_event_notification_task(event_id, notification_type):
    """Send notifications for event-related activities"""
    try:
        event = Event.objects.get(id=event_id)

        if notification_type == 'new_event' and event.cca:
            # Notify all CCA members about new event
            cca_members = CCAMember.objects.filter(cca=event.cca)
            for member in cca_members:
                if member.user != event.created_by:  # Don't notify creator
                    send_notification(
                        recipient=member.user,
                        title=f"New Event: {event.name}",
                        message=f"{event.cca.name} has created a new event '{event.name}' on {event.date}",
                        notification_type=NotificationType.EVENT_UPDATE,
                        related_object_id=event.id,
                        related_object_type='event'
                    )

        return f"Sent notifications for event {event.name}"
    except Event.DoesNotExist:
        return f"Event {event_id} not found"


@shared_task
def send_event_reminders():
    """Send reminders for upcoming events (run daily)"""
    tomorrow = timezone.now().date() + timedelta(days=1)
    upcoming_events = Event.objects.filter(date=tomorrow)

    count = 0
    for event in upcoming_events:
        participants = EventParticipant.objects.filter(event=event)
        for participant in participants:
            send_notification(
                recipient=participant.user,
                title=f"Event Reminder: {event.name}",
                message=f"Don't forget! {event.name} is tomorrow at {event.location}",
                notification_type=NotificationType.EVENT_UPDATE,
                related_object_id=event.id,
                related_object_type='event'
            )
            count += 1

    return f"Sent {count} event reminders"


@shared_task
def send_registration_deadline_reminders():
    """Send reminders for registration deadlines (run daily)"""
    tomorrow = timezone.now().date() + timedelta(days=1)
    events_with_deadline = Event.objects.filter(registration_deadline=tomorrow)

    count = 0
    for event in events_with_deadline:
        if event.cca:
            cca_members = CCAMember.objects.filter(cca=event.cca)
            registered_users = EventParticipant.objects.filter(
                event=event).values_list('user', flat=True)

            for member in cca_members:
                if member.user.id not in registered_users:
                    send_notification(
                        recipient=member.user,
                        title=f"Registration Deadline Tomorrow: {event.name}",
                        message=f"Last chance to register for {event.name}! Registration closes tomorrow.",
                        notification_type=NotificationType.EVENT_UPDATE,
                        related_object_id=event.id,
                        related_object_type='event'
                    )
                    count += 1

    return f"Sent {count} registration deadline reminders"
