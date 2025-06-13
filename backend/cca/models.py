from django.db import models
from django.conf import settings
import os



class CCA(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='cca_logos', blank=True, null=True, help_text="Upload a logo for the CCA")
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='CCAMembership', related_name='ccas', blank=True)

class CCAMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cca = models.ForeignKey(CCA, on_delete=models.CASCADE)
    date_joined = models.DateField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, null=True)
