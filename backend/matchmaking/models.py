from django.db import models
from django.conf import settings
from django.utils import timezone
import datetime


class Lobby(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    sport = models.CharField(max_length=50)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(blank=True, null=True)
    location = models.CharField(max_length=200)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='LobbyMember', related_name='lobbies', blank=True)
    max_capacity = models.PositiveIntegerField(default=10)
    open_lobby = models.BooleanField(default=True)
    password = models.CharField(max_length=30, blank=True)
    reminder_sent_at = models.DateTimeField(null=True, blank=True)

    @property
    def start_datetime(self):
        naive_datetime = datetime.datetime.combine(self.date, self.start_time)
        return timezone.make_aware(naive_datetime)

    @property
    def participant_count(self):
        return self.lobbymember_set.count()

    @property
    def is_full(self):
        return self.participant_count >= self.max_capacity

    @property
    def needs_reminder(self):
        if self.reminder_sent_at:
            return False

        now = timezone.now()
        start_dt = self.start_datetime

        if start_dt <= now:
            return False

        time_until_start = start_dt - now
        hours_until = time_until_start.total_seconds() / 3600

        return 1.5 <= hours_until <= 2.5

    def mark_reminder_sent(self):
        self.reminder_sent_at = timezone.now()
        self.save(update_fields=['reminder_sent_at'])

    def __str__(self):
        return self.name


class LobbyMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    lobby = models.ForeignKey(Lobby, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ('player', 'Player'),
        ('admin', 'Administrator'),
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='player')
    date_joined = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} in {self.lobby.sport} game"
