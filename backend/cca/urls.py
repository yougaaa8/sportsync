from django.urls import path
from . import views

urlpatterns = [
    # CCA endpoints
    path('list/', views.CCAListView.as_view(), name='cca-list'),
    path('<int:pk>/', views.CCADetailView.as_view(), name='cca-detail'),
    path('<int:pk>/members/', views.CCAMembersView.as_view(), name='cca-members'),
    path('<int:pk>/training/', views.CCATrainingView.as_view(), name='cca-training'),

    # Additional training session management
    path('<int:cca_id>/training/<int:session_id>/join/',
         views.join_training_session, name='join-training-session'),
    path('<int:cca_id>/training/<int:session_id>/leave/',
         views.leave_training_session, name='leave-training-session'),
]
