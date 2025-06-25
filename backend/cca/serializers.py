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
    class Meta:
        model = CCAMember
        fields = '__all__'

class TrainingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = '__all__'

class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
