from rest_framework import serializers
from .models import Tournament, TournamentSport, Team, TeamMember, Match


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = '__all__'
        read_only_fields = ['id']


class TournamentSportSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentSport
        fields = '__all__'
        read_only_fields = ['id', 'tournament']


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['id']


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'
        read_only_fields = ['id']


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ['id']
