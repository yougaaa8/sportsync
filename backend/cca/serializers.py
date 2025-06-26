from rest_framework import serializers
from .models import CCA, CCAMember, TrainingSession, Attendance


class CCAListSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCA
        fields = [
            'id', 'name', 'description', 'logo'
        ]


class CCADetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CCA
        fields = '__all__'


class CCAMemberSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField()
    last_name = serializers.SerializerMethodField()

    class Meta:
        model = CCAMember
        fields = [
            'id', 'user', 'cca', 'position', 'role', 'date_joined',
            'is_active', 'emergency_contact', 'notes',
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
