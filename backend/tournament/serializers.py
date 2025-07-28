from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import Tournament, TournamentSport, Team, TeamMember, Match
from users.serializers import UserProfileSerializer


class TournamentSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'status', 'start_date', 'end_date',
                  'description', 'logo', 'logo_url']
        read_only_fields = ['id']

    def get_logo_url(self, obj):
        if obj.logo:
            try:
                url, options = cloudinary_url(
                    obj.logo.public_id,
                    width=300,
                    height=300,
                    crop='fill',
                    gravity='face',
                    quality='auto',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return None
        return None


class TournamentSportSerializer(serializers.ModelSerializer):
    tournament = TournamentSerializer(read_only=True)

    class Meta:
        model = TournamentSport
        fields = ['id', 'tournament', 'sport', 'gender', 'description']
        read_only_fields = ['id', 'tournament']


class TeamSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    tournament_sport = TournamentSportSerializer(read_only=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'tournament_sport',
                  'logo', 'logo_url', 'description']
        read_only_fields = ['id', 'tournament_sport']

    def get_logo_url(self, obj):
        if obj.logo:
            try:
                url, options = cloudinary_url(
                    obj.logo.public_id,
                    width=300,
                    height=300,
                    crop='fill',
                    gravity='face',
                    quality='auto',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return None
        return None


class TeamMemberSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()
    team = TeamSerializer(read_only=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'user', 'jersey_name', 'jersey_number',
                  'role', 'photo', 'photo_url']
        read_only_fields = ['id', 'team']

    def get_photo_url(self, obj):
        if obj.photo:
            try:
                url, options = cloudinary_url(
                    obj.photo.public_id,
                    width=400,
                    height=400,
                    crop='fill',
                    gravity='face',
                    quality='auto',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return None
        return None


class MatchSerializer(serializers.ModelSerializer):
    tournament_sport = TournamentSportSerializer(read_only=True)
    team1 = TeamSerializer(read_only=True)
    team2 = TeamSerializer(read_only=True)

    class Meta:
        model = Match
        fields = ['id', 'tournament_sport', 'team1', 'team2', 'round', 'date',
                  'venue', 'score_team1', 'score_team2', 'winner', 'match_notes']
        read_only_fields = ['id', 'tournament_sport',
                            'team1', 'team2']


# Upload serializers for file validation
class TournamentLogoUploadSerializer(serializers.Serializer):
    logo = serializers.ImageField()

    def validate_logo(self, value):

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value


class TeamLogoUploadSerializer(serializers.Serializer):
    logo = serializers.ImageField()

    def validate_logo(self, value):

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value


class TeamMemberPhotoUploadSerializer(serializers.Serializer):
    photo = serializers.ImageField()

    def validate_photo(self, value):

        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value
