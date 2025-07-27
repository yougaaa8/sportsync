from celery import shared_task
from django.utils import timezone
from users.models import User
from .services import NotificationService
from .models import NotificationType


@shared_task
def process_scheduled_notifications():
    """Process notifications that are scheduled to be sent"""
    from .models import Notification

    due_notifications = Notification.objects.filter(
        is_sent=False,
        scheduled_for=timezone.now()
    )

    service = NotificationService()
    count = 0

    for notification in due_notifications:
        service.send_notification(notification)
        count += 1

    return f"Processed {count} scheduled notifications"


@shared_task
def cleanup_old_notifications():
    """Clean up notifications older than 30 days"""
    from django.utils import timezone
    from datetime import timedelta
    from .models import Notification

    cutoff_date = timezone.now() - timedelta(days=30)

    deleted_count = Notification.objects.filter(
        created_at__lt=cutoff_date,
        is_read=True
    ).delete()[0]

    return f"Cleaned up {deleted_count} old notifications"
