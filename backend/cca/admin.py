from django.contrib import admin
from .models import CCA, CCAMember, TrainingSession, Attendance

# Register your models here.
admin.site.register(CCA)
admin.site.register(CCAMember)
admin.site.register(TrainingSession)
admin.site.register(Attendance)
