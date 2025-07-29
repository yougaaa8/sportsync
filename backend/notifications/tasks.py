from celery import shared_task
from django.utils import timezone
from django.db import transaction
from .services import NotificationService
from .models import Notification
import gc


@shared_task(bind=True, max_retries=3)
def process_scheduled_notifications(self, batch_size=50):
    try:
        total_processed = 0

        while True:
            with transaction.atomic():
                due_notifications = list(
                    Notification.objects.select_related('recipient')
                    .filter(
                        is_sent=False,
                        scheduled_for__lte=timezone.now()
                    )[:batch_size]
                )

            if not due_notifications:
                break

            service = NotificationService()
            batch_processed = 0

            for notification in due_notifications:
                try:
                    service.send_notification(notification)
                    batch_processed += 1
                except Exception as e:
                    continue

            total_processed += batch_processed

            gc.collect()

            if len(due_notifications) < batch_size:
                break

        return f"Processed {total_processed} scheduled notifications"

    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)


@shared_task(bind=True)
def cleanup_old_notifications(self, days=30, batch_size=1000):
    try:
        from django.utils import timezone
        from datetime import timedelta

        cutoff_date = timezone.now() - timedelta(days=days)
        total_deleted = 0

        while True:
            with transaction.atomic():
                old_notification_ids = list(
                    Notification.objects.filter(
                        created_at__lt=cutoff_date,
                        is_read=True
                    ).values_list('id', flat=True)[:batch_size]
                )

            if not old_notification_ids:
                break

            deleted_count = Notification.objects.filter(
                id__in=old_notification_ids
            ).delete()[0]

            total_deleted += deleted_count

            gc.collect()

            if len(old_notification_ids) < batch_size:
                break

        return f"Cleaned up {total_deleted} old notifications"

    except Exception as exc:
        raise self.retry(exc=exc, countdown=300)
