from rest_framework import serializers
from cloudinary.utils import cloudinary_url
from .models import CCA, CCAMember, TrainingSession, Attendance


class CCAListSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = CCA
        fields = [
            'id', 'name', 'description', 'logo', 'logo_url'
        ]

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


class CCADetailSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = CCA
        fields = ['id', 'name', 'description', 'logo', 'logo_url',
                  'contact_email', 'website', 'instagram', 'facebook', 'members']

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


class CCAMemberSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = CCAMember
        fields = [
            'id', 'user', 'cca', 'position', 'role', 'date_joined',
            'is_active', 'notes',
            'first_name', 'last_name'
        ]

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name


class TrainingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = '__all__'


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'


class LogoUploadSerializer(serializers.Serializer):
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
