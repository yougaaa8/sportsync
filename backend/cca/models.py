from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy


class CCA(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    logo = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/cca_logo/',
        transformation={
            'width': 300,
            'height': 300,
            'crop': 'fill',
            'gravity': 'face',
            'quality': 'auto',
            'fetch_format': 'auto'
        },
        help_text="Upload a cca logo"
    )
    contact_email = models.EmailField(blank=True)
    website = models.URLField(
        blank=True, help_text="Official website of the CCA")
    instagram = models.URLField(
        blank=True, help_text="Instagram profile of the CCA")
    facebook = models.URLField(
        blank=True, help_text="Facebook page of the CCA")
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through='CCAMember', related_name='ccas', blank=True)

    def __str__(self):
        return self.name

    def delete_old_logo(self):
        """Delete old logo from Cloudinary when updating"""
        if self.logo:
            try:
                destroy(self.logo.public_id)
            except Exception as e:
                print(f"Error deleting old logo: {e}")


class CCAMember(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    cca = models.ForeignKey(CCA, on_delete=models.CASCADE)
    POSITION_CHOICES = [
        ('member', 'Member'),
        ('committee', 'Committee'),
    ]
    position = models.CharField(
        max_length=10, choices=POSITION_CHOICES, default='member')
    role = models.CharField(max_length=100, blank=True)
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} {self.cca.name} membership status"


class TrainingSession(models.Model):
    cca = models.ForeignKey(CCA, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    location = models.CharField(max_length=200)
    max_participants = models.PositiveIntegerField(default=30)
    note = models.TextField(blank=True)

    @property
    def participant_count(self):
        return self.attendance_set.filter(status='registered').count()

    @property
    def is_full(self):
        return self.participant_count >= self.max_participants

    def __str__(self):
        return f"{self.cca.name} training Session on {self.date} at {self.location}"


class Attendance(models.Model):
    member = models.ForeignKey(CCAMember, on_delete=models.CASCADE)
    training_session = models.ForeignKey(
        TrainingSession, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
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
