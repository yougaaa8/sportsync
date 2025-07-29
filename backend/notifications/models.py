from django.db import models
from django.conf import settings


class NotificationType(models.TextChoices):
    TRAINING_REMINDER = 'training_reminder', 'Training Reminder'
    EVENT_UPDATE = 'event_update', 'Event Update'
    MATCHMAKING_UPDATE = 'matchmaking_update', 'Matchmaking Update'
    CCA_ANNOUNCEMENT = 'cca_announcement', 'CCA Announcement'
    TOURNAMENT_UPDATE = 'tournament_update', 'Tournament Update'
    MERCH_UPDATE = 'merch_update', 'Merchandise Update'


class NotificationChannel(models.TextChoices):
    IN_APP = 'in_app', 'In-App'
    EMAIL = 'email', 'Email'
    BOTH = 'both', 'Both'


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications', db_index=True)
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=50, choices=NotificationType.choices, db_index=True)
    channel = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.IN_APP)

    # To link to other objects
    related_object_id = models.IntegerField(null=True, blank=True)
    related_object_type = models.CharField(
        max_length=50, null=True, blank=True)

    is_read = models.BooleanField(default=False, db_index=True)
    is_sent = models.BooleanField(default=False, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    scheduled_for = models.DateTimeField(null=True, blank=True, db_index=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read']),
            models.Index(fields=['is_sent', 'scheduled_for']),
            models.Index(fields=['created_at', 'is_read']),
        ]

    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"


class UserNotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_preferences')

    # Channel preferences
    training_reminders = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.BOTH)
    event_updates = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.BOTH)
    matchmaking_updates = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.IN_APP)
    cca_announcements = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.BOTH)
    tournament_updates = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.BOTH)
    merch_updates = models.CharField(
        max_length=20, choices=NotificationChannel.choices, default=NotificationChannel.BOTH)

    def __str__(self):
        return f"Preferences for {self.user.get_full_name()}"
