from rest_framework import serializers
from .models import Event, EventParticipant


class EventListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'name', 'date', 'cca', 'organizer', 'location',
                  'registration_fee', 'is_public']


class EventDetailSerializer(serializers.ModelSerializer):
    participants_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = '__all__'

    def get_participants_count(self, obj):
        return obj.eventparticipant_set.count()


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
