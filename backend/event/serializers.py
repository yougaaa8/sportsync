from rest_framework import serializers
from .models import Event, EventParticipant
from cloudinary.utils import cloudinary_url


class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'cca', 'organizer', 'location',
                  'registration_fee', 'is_public']


class EventDetailSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()
    poster_url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_participants_count(self, obj):
        return obj.eventparticipant_set.count()

    def get_poster_url(self, obj):
        """Get optimized poster URL from Cloudinary"""
        if obj.poster:
            try:
                url, options = cloudinary_url(
                    obj.poster.public_id,
                    width=600,
                    height=800,
                    crop='fill',
                    gravity='auto',
                    quality='auto:good',
                    fetch_format='auto'
                )
                return url
            except Exception:
                return None
        return None


class EventSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipant
        fields = ['event', 'user']

    def validate(self, attrs):
        event = attrs.get('event')
        user = attrs.get('user')

        if EventParticipant.objects.filter(event=event, user=user).exists():
            raise serializers.ValidationError(
                "User is already registered for this event.")

        return attrs


class EventParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventParticipant
        fields = '__all__'


class PosterUploadSerializer(serializers.Serializer):
    poster = serializers.ImageField()

    def validate_poster(self, value):
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
