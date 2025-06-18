from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator
from django.db import models
from PIL import Image
import os


def user_profile_image_path(instance, filename):
    """Generate file path for user profile images"""
    # Get file extension
    ext = filename.split('.')[-1]
    # Create filename: user_id.extension
    filename = f'{instance.id}.{ext}'
    # Return the complete path
    return os.path.join('profile_pics', filename)


class User(AbstractUser):
    """Extended User model for NUS students"""
    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    profile_picture = models.ImageField(upload_to=user_profile_image_path, validators=[FileExtensionValidator(
        allowed_extensions=['jpg', 'jpeg', 'png'])], blank=True, null=True, help_text="Upload a profile picture (JPG, JPEG, PNG only)")
    STATUS_CHOICES = [
        ('student', 'Student'),
        ('staff', 'Staff'),
        ('others', 'Others'),
    ]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICES, default='student', blank=True)
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

    def resize_image(self):
        """Resize profile picture to max 300x300 pixels"""
        try:
            img = Image.open(self.profile_picture.path)

            # Resize if image is too large
            if img.height > 300 or img.width > 300:
                output_size = (300, 300)
                img.thumbnail(output_size, Image.Resampling.LANCZOS)
                img.save(self.profile_picture.path)
        except Exception as e:
            print(f"Error resizing image: {e}")

    class Meta:
        db_table = 'users_user'
