from rest_framework import serializers
from .models import Notification, UserNotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'id', 'title', 'message', 'notification_type',
            'is_read', 'created_at', 'related_object_id',
            'related_object_type'
        ]
        read_only_fields = ['id', 'created_at']


class UserNotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotificationPreference
        fields = [
            'training_reminders', 'event_updates', 'match_updates',
            'cca_announcements', 'tournament_updates', 'merch_updates', 'reminder_hours_before'
        ]
