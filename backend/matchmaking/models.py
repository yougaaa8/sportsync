from django.db import models
from django.conf import settings

# Create your models here.


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
    password = models.CharField(max_length=100, blank=True)

    @property
    def participant_count(self):
        return self.lobbymember_set.count()

    @property
    def is_full(self):
        return self.participant_count >= self.max_capacity

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
