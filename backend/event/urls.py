from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.EventListView.as_view(), name='event-list'),
    path('<int:pk>/', views.EventDetailView.as_view(), name='event-detail'),
    path('<int:pk>/edit/', views.EventEditView.as_view(), name='event-edit'),
    path('<int:pk>/signup/', views.EventSignUpView.as_view(), name='event-signup'),
    path('<int:pk>/leave/', views.EventLeaveView.as_view(), name='event-leave'),
    path('<int:pk>/participants/', views.EventParticipantListView.as_view(),
         name='event-participant-list'),
    path('<int:pk>/upload-poster/',
         views.upload_poster, name='upload-poster'),
    path('create/', views.EventCreateView.as_view(), name='event-create'),
]
