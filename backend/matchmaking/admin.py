from django.contrib import admin
from .models import Lobby, LobbyMember

# Register your models here.
admin.site.register(Lobby)
admin.site.register(LobbyMember)
