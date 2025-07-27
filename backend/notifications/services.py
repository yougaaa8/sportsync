from django.core.mail import send_mail
from django.utils import timezone
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification, NotificationType, NotificationChannel


class NotificationService:
    def __init__(self):
        self.channel_layer = get_channel_layer()

    def create_notification(self, recipient, title, message, notification_type,
                            related_object_id=None, related_object_type=None,
                            scheduled_for=None):
        """Create and send a notification"""

        # Get user preferences
        user_prefs = getattr(recipient, 'notification_preferences', None)
        if not user_prefs:
            channel = NotificationChannel.BOTH
        else:
            channel = self._get_channel_preference(
                user_prefs, notification_type)

        # Create notification
        notification = Notification.objects.create(
            recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
            channel=channel,
            related_object_id=related_object_id,
            related_object_type=related_object_type,
            scheduled_for=scheduled_for or timezone.now()
        )

        # Send immediately if not scheduled for later
        if not scheduled_for or scheduled_for <= timezone.now():
            self.send_notification(notification)

        return notification

    def send_notification(self, notification):
        """Send notification through appropriate channels"""
        try:
            if notification.channel in [NotificationChannel.IN_APP, NotificationChannel.BOTH]:
                self._send_in_app_notification(notification)

            if notification.channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
                self._send_email_notification(notification)

            notification.is_sent = True
            notification.sent_at = timezone.now()
            notification.save()

        except Exception as e:
            print(f"Error sending notification {notification.id}: {e}")

    def _send_in_app_notification(self, notification):
        """Send real-time notification via WebSocket"""
        if self.channel_layer:
            async_to_sync(self.channel_layer.group_send)(
                f"user_{notification.recipient.id}",
                {
                    "type": "notification_message",
                    "notification": {
                        "id": notification.id,
                        "title": notification.title,
                        "message": notification.message,
                        "type": notification.notification_type,
                        "created_at": notification.created_at.isoformat(),
                        "related_object_id": notification.related_object_id,
                        "related_object_type": notification.related_object_type,
                        "is_read": notification.is_read,
                    }
                }
            )

    def _send_email_notification(self, notification):
        """Send email notification"""
        try:
            context = {
                'user': notification.recipient,
                'title': notification.title,
                'message': notification.message,
                'notification_type': notification.notification_type
            }

            # Simple text email for now
            send_mail(
                subject=f"SportsSync: {notification.title}",
                message=notification.message,
                from_email='noreply@sportsync.nus.edu',
                recipient_list=[notification.recipient.email],
                fail_silently=False,
            )

        except Exception as e:
            print(
                f"Error sending email for notification {notification.id}: {e}")

    def _get_channel_preference(self, user_prefs, notification_type):
        """Get user's preferred channel for this notification type"""
        preference_map = {
            NotificationType.TRAINING_REMINDER: user_prefs.training_reminders,
            NotificationType.EVENT_UPDATE: user_prefs.event_updates,
            NotificationType.MATCH_UPDATE: user_prefs.match_updates,
            NotificationType.CCA_ANNOUNCEMENT: user_prefs.cca_announcements,
            NotificationType.TOURNAMENT_UPDATE: user_prefs.tournament_updates,
            NotificationType.MERCH_UPDATE: user_prefs.merch_updates,
        }
        return preference_map.get(notification_type, NotificationChannel.BOTH)


def send_notification(recipient, title, message, notification_type, **kwargs):
    """Quick way to send a notification"""
    service = NotificationService()
    return service.create_notification(recipient, title, message, notification_type, **kwargs)
