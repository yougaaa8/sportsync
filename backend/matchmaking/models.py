from django.db import models
from django.conf import settings

# Create your models here.


class Lobby(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    sport = models.CharField(max_length=50)
    start_time = models.TimeField()
    end_time = models.TimeField(blank=True)
    location = models.CharField(max_length=200)
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='LobbyMember', related_name='lobbies', blank=True)

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
