from django.db import models
from django.conf import settings

# Create your models here.


class Event(models.Model):
    name = models.CharField(max_length=255)
    cca = models.ForeignKey(
        'cca.CCA', related_name='events', on_delete=models.CASCADE, blank=True, null=True)
    organizer = models.TextField(
        max_length=255, blank=True, help_text="Optional if organized by a club")
    description = models.TextField(max_length=255, blank=True)
    date = models.DateTimeField()
    location = models.TextField(max_length=255, blank=True)
    registration_fee = models.DecimalField(
        max_digits=5, decimal_places=2, default=0.00)
    registration_deadline = models.DateTimeField()
    is_public = models.BooleanField(
        default=True, help_text="Is this event open to everyone?")
    poster = models.ImageField(
        upload_to='event_posters/', blank=True, null=True)
    contact_point = models.TextField(
        max_length=255, blank=True, help_text="Contact point for the event")

    def __str__(self):
        return self.name


class EventParticipant(models.Model):
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    paid_registration_fee = models.BooleanField(
        default=False)
    registered_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Automatically mark as paid if registration fee is 0
        if self.event.registration_fee == 0:
            self.paid_registration_fee = True
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.event.name}"
