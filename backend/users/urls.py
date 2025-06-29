from django.urls import path
from . import views

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),

    # Profile management
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/picture/upload/', views.upload_profile_picture,
         name='upload_profile_picture'),
    path('profile/picture/delete/', views.delete_profile_picture,
         name='delete_profile_picture'),

    # User lookup
    path('get-user-profile/', views.get_user_by_email,
         name='get_user_profile_by_email'),
]
