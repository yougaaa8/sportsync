from django.db import models
from django.conf import settings
import os

from django.utils.autoreload import start_django


class CCA(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='cca_logos', blank=True,
                             null=True, help_text="Upload a logo for the CCA")
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='CCAMembership', related_name='ccas', blank=True)

    def __str__(self):
        return self.name


class CCAMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    cca = models.ForeignKey(CCA, on_delete=models.CASCADE)
    role = models.CharField(max_length=100)
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    emergency_contact = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return super().__str__()


class TrainingSession(models.Model):
    cca = models.ForeignKey(CCA, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=200)
    max_participants = models.PositiveIntegerField(default=30)
    note = models.TextField(blank=True)

    def __str__(self):
        return f"{self.cca.name} training Session on {self.date} at {self.location}"


class Attendance(models.Model):
    member = models.ForeignKey(CCAMembership, on_delete=models.CASCADE)
    training_session = models.ForeignKey(
        TrainingSession, on_delete=models.CASCADE)
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('waitlisted', 'Waitlisted'),
        ('attended', 'Attended'),
        ('absent', 'Absent'),
        ('cancelled', 'Cancelled'),
        ('na', 'Not Applicable')
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='na')
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.member.user.get_full_name()} attendance for {self.training_session}"
