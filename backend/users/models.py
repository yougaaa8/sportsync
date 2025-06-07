from random import choice
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Extended User model for NUS students"""
    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    STATUS_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('others', 'Others'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='student', blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email

    def get_full_name(self):
            """Return the first_name plus the last_name, with a space in between."""
            return f'{self.first_name} {self.last_name}'.strip()

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name


    class Meta:
        db_table = 'users_user'
