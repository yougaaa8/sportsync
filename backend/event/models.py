from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy


class Event(models.Model):
    name = models.CharField(max_length=255)
    cca = models.ForeignKey(
        'cca.CCA', related_name='events', on_delete=models.CASCADE, blank=True, null=True)
    admins = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, help_text="Optional if organized by a club")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='events', on_delete=models.CASCADE)
    description = models.TextField(blank=True)
    date = models.DateField()
    location = models.TextField(max_length=255, blank=True)
    registration_deadline = models.DateField()
    is_public = models.BooleanField(
        default=True, help_text="Is this event open to everyone?")
    poster = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/event_poster/',
        transformation={
            'width': 600,
            'height': 800,
            'crop': 'fill',
            'gravity': 'auto',
            'quality': 'auto:good',
            'fetch_format': 'auto'
        },
        help_text="Upload an event poster"
    )
    contact_point = models.TextField(
        max_length=255, blank=True, help_text="Contact point for the event")

    def __str__(self):
        return self.name

    def delete_old_poster(self):
        """Delete old poster from Cloudinary when updating"""
        if self.poster:
            try:
                destroy(self.poster.public_id)
            except Exception as e:
                print(f"Error deleting old poster: {e}")


class EventParticipant(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.event.name}"
