from celery import shared_task
from notifications.services import send_notification
from notifications.models import NotificationType
from django.utils import timezone


@shared_task
def send_lobby_notification(lobby_id, title, message, notification_type, exclude_user_id=None):
    """
    Send notifications to all lobby members except the excluded user
    """
    from .models import LobbyMember

    try:
        members = LobbyMember.objects.filter(lobby_id=lobby_id)

        if exclude_user_id:
            members = members.exclude(user_id=exclude_user_id)

        notification_count = 0
        for member in members:
            send_notification(
                recipient=member.user,
                title=title,
                message=message,
                notification_type=notification_type,
                related_object_id=lobby_id,
                related_object_type='lobby'
            )
            notification_count += 1

        return f"Sent {notification_count} notifications for lobby {lobby_id}"

    except Exception as e:
        return f"Error sending lobby notifications: {str(e)}"


@shared_task
def send_lobby_reminders():
    """
    Send reminder notifications for lobbies starting in 2 hours
    """
    from .models import Lobby

    try:
        now = timezone.now()
        processed_lobbies = 0
        total_notifications = 0

        candidate_lobbies = Lobby.objects.filter(
            date__gte=now.date(),
            reminder_sent_at__isnull=True
        ).select_related().prefetch_related('lobbymember_set__user')

        for lobby in candidate_lobbies:
            try:
                if not lobby.needs_reminder:
                    continue
                lobby.refresh_from_db()
                if lobby.reminder_sent_at:
                    continue
                time_until_start = lobby.start_datetime - now  # Use start_datetime
                hours_until = round(time_until_start.total_seconds() / 3600, 1)

                title = f"Lobby Reminder: {lobby.name}"
                message = (
                    f"Your {lobby.sport} session at {lobby.location} "
                    f"starts in {hours_until} hours at {lobby.start_datetime.strftime('%I:%M %p')} "
                    f"on {lobby.start_datetime.strftime('%B %d, %Y')}"
                )

                members = lobby.lobbymember_set.all()
                member_count = 0

                for member in members:
                    try:
                        send_notification(
                            recipient=member.user,
                            title=title,
                            message=message,
                            notification_type=NotificationType.MATCHMAKING_UPDATE,
                            related_object_id=lobby.id,
                            related_object_type='lobby'
                        )
                        member_count += 1
                        total_notifications += 1
                    except Exception as member_error:
                        continue

                lobby.mark_reminder_sent()
                processed_lobbies += 1

            except Exception as lobby_error:
                continue

        result_message = (
            f"Reminder task completed: "
            f"Processed {processed_lobbies} lobbies, "
            f"Sent {total_notifications} reminders, "
        )

        return result_message

    except Exception as e:
        error_message = f"Error in send_lobby_reminders: {str(e)}"
        return error_message
