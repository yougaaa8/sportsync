from django.urls import path
from . import views

urlpatterns = [
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(),
         name='notification-detail'),
    path('<int:notification_id>/read/',
         views.mark_notification_read, name='mark-read'),
    path('mark-all-read/', views.mark_all_read, name='mark-all-read'),
    path('unread-count/', views.unread_count, name='unread-count'),
    path('preferences/', views.NotificationPreferencesView.as_view(),
         name='preferences'),
]
