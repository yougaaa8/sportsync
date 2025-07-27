from celery import shared_task
from notifications.services import send_notification
from notifications.models import NotificationType
from .models import CCA, CCAMember, TrainingSession


@shared_task
def notify_cca_members_new_training(cca_id, training_session_id):
    """
    Notify all CCA members about a new training session
    """
    try:
        cca = CCA.objects.get(id=cca_id)
        training_session = TrainingSession.objects.get(id=training_session_id)

        # Get all active members of the CCA
        members = CCAMember.objects.filter(cca=cca, is_active=True)

        count = 0
        for member in members:
            try:
                send_notification(
                    recipient=member.user,
                    title=f"New Training Session - {cca.name}",
                    message=f"A new training session has been scheduled for {training_session.date} at {training_session.start_time} in {training_session.location}. Join now!",
                    notification_type=NotificationType.CCA_ANNOUNCEMENT,
                    related_object_id=training_session.id,
                    related_object_type='training_session'
                )
                count += 1
            except Exception as e:
                print(f"Failed to notify user {member.user.username}: {e}")

        return f"Notified {count} members about new training session"

    except (CCA.DoesNotExist, TrainingSession.DoesNotExist) as e:
        return f"Error: {e}"


@shared_task
def send_training_reminders():
    """
    Send reminders for upcoming training sessions (daily)
    """
    from django.utils import timezone
    from datetime import timedelta

    # Get training sessions happening tomorrow
    tomorrow = timezone.now().date() + timedelta(days=1)
    upcoming_sessions = TrainingSession.objects.filter(date=tomorrow)

    total_notifications = 0

    for session in upcoming_sessions:
        from .models import Attendance
        registered_attendees = Attendance.objects.filter(
            training_session=session,
            status='registered'
        )

        for attendance in registered_attendees:
            try:
                send_notification(
                    recipient=attendance.member.user,
                    title=f"Training Reminder - {session.cca.name}",
                    message=f"Reminder! You have training tomorrow ({session.date}) at {session.start_time} in {session.location}.",
                    notification_type=NotificationType.TRAINING_REMINDER,
                    related_object_id=session.id,
                    related_object_type='training_session'
                )
                total_notifications += 1
            except Exception as e:
                print(
                    f"Failed to send reminder to {attendance.member.user.username}: {e}")

    return f"Sent {total_notifications} training reminders"


@shared_task
def send_cca_announcement(cca_id, title, message, sender_user_id):
    """Send announcement to all CCA members"""
    try:
        from django.contrib.auth import get_user_model
        User = get_user_model()

        cca = CCA.objects.get(id=cca_id)
        sender = User.objects.get(id=sender_user_id)

        cca_members = CCAMember.objects.filter(cca=cca, is_active=True)

        sent_count = 0
        for member in cca_members:
            send_notification(
                recipient=member.user,
                title=f"Announcement - {cca.name}",
                message=f"{title}\n\n{message}\n\n- {sender.get_full_name() or sender.email}",
                notification_type=NotificationType.CCA_ANNOUNCEMENT,
                related_object_id=cca.id,
                related_object_type='cca'
            )
            sent_count += 1

        return f"Sent announcement to {sent_count} members of {cca.name}"

    except Exception as e:
        return f"Error sending announcement: {str(e)}"
