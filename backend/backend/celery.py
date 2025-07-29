import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = Celery('backend')

app.conf.update(
    worker_max_memory_per_child=256 * 1024,
    worker_disable_rate_limits=True,

    worker_max_tasks_per_child=100,

    worker_prefetch_multiplier=1,

    # Task routing
    task_routes={
        'notifications.tasks.process_scheduled_notifications': {'queue': 'notifications'},
        'notifications.tasks.cleanup_old_notifications': {'queue': 'cleanup'},
        'notifications.tasks.send_single_notification': {'queue': 'notifications'},
    },

    result_expires=3600,
)

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
