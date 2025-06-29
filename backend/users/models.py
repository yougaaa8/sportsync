from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy
import cloudinary.uploader


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """Extended User model for NUS students"""
    username = None
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    # Using Cloudinary for profile pictures
    profile_picture = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/profiles/',
        transformation={
            'width': 300,
            'height': 300,
            'crop': 'fill',
            'gravity': 'face',
            'quality': 'auto',
            'fetch_format': 'auto'
        },
        help_text="Upload a profile picture"
    )

    STATUS_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('others', 'Others'),
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='student', blank=True)
    emergency_contact = models.CharField(max_length=200, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        return f'{self.first_name} {self.last_name}'.strip()

    def delete_old_profile_picture(self):
        """Delete old profile picture from Cloudinary when updating"""
        if self.profile_picture:
            try:
                destroy(self.profile_picture.public_id)
            except Exception as e:
                print(f"Error deleting old profile picture: {e}")

    class Meta:
        db_table = 'users_user'
