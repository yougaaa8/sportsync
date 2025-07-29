import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
app = Celery('backend')

app.conf.update(
    worker_max_memory_per_child=256 * 1024,
    worker_max_tasks_per_child=50,
    worker_prefetch_multiplier=1,

    worker_concurrency=2,

    worker_disable_rate_limits=True,
    task_acks_late=True,
    task_reject_on_worker_lost=True,

    result_expires=1800,
    result_backend_max_retries=3,

    broker_connection_retry_on_startup=True,
    broker_connection_retry=True,
    broker_connection_max_retries=10,


    # Task routing
    task_routes={
        'notifications.tasks.process_scheduled_notifications': {'queue': 'notifications'},
        'notifications.tasks.cleanup_old_notifications': {'queue': 'cleanup'},
        'notifications.tasks.send_single_notification': {'queue': 'notifications'},
    },
)

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
