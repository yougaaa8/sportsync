from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import Tournament, TournamentSport, Team, TeamMember, Match


class TournamentSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'status', 'start_date', 'end_date',
                  'description', 'logo', 'logo_url']
        read_only_fields = ['id']

    def get_logo_url(self, obj):
        """Get optimized logo URL from Cloudinary"""
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
    class Meta:
        model = TournamentSport
        fields = '__all__'
        read_only_fields = ['id', 'tournament']


class TeamSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['id', 'name', 'tournament_sport',
                  'logo', 'logo_url', 'description']
        read_only_fields = ['id', 'tournament_sport']

    def get_logo_url(self, obj):
        """Get optimized logo URL from Cloudinary"""
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
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ['id', 'team', 'user', 'jersey_name', 'jersey_number',
                  'role', 'photo', 'photo_url', 'first_name', 'last_name']
        read_only_fields = ['id', 'team']

    def get_photo_url(self, obj):
        """Get optimized photo URL from Cloudinary"""
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

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'
        read_only_fields = ['id', 'tournament_sport']


# Upload serializers for file validation
class TournamentLogoUploadSerializer(serializers.Serializer):
    logo = serializers.ImageField()

    def validate_logo(self, value):
        """Validate image file"""
        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value


class TeamLogoUploadSerializer(serializers.Serializer):
    logo = serializers.ImageField()

    def validate_logo(self, value):
        """Validate image file"""
        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value


class TeamMemberPhotoUploadSerializer(serializers.Serializer):
    photo = serializers.ImageField()

    def validate_photo(self, value):
        """Validate image file"""
        # Check file size (max 5MB)
        if value.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image file too large ( > 5MB )")

        # Check file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if value.content_type not in allowed_types:
            raise serializers.ValidationError(
                "Unsupported file type. Please upload JPG, PNG, or WebP images."
            )

        return value
