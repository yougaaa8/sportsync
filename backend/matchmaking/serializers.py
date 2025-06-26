from rest_framework import serializers
from .models import Lobby, LobbyMember


class LobbyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lobby
        fields = ['id', 'name', 'description', 'sport', 'date',
                  'start_time', 'end_time', 'location', 'open_lobby', 'max_capacity']


class LobbyDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lobby
        fields = ['name', 'description', 'sport', 'date',
                  'start_time', 'end_time', 'location', 'open_lobby', 'password', 'max_capacity']


class LobbyMemberSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = LobbyMember
        fields = ['id', 'user', 'lobby', 'status',
                  'date_joined', 'notes', 'first_name', 'last_name']

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name
