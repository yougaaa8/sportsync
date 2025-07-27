from django.contrib import admin
from .models import Notification, UserNotificationPreference

admin.site.register(Notification)
admin.site.register(UserNotificationPreference)
