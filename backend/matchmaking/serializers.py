from rest_framework import serializers
from .models import Lobby, LobbyMember


class LobbyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lobby
        fields = ['id', 'name', 'description', 'sport',
                  'start_time', 'end_time', 'location']


class LobbyMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = LobbyMember
        fields = ['id', 'user', 'lobby', 'status', 'date_joined', 'notes']
