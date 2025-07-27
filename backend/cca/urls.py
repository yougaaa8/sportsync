from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.CCAListView.as_view(), name='cca-list'),
    path('<int:cca_id>/', views.CCADetailView.as_view(), name='cca-detail'),
    path('<int:cca_id>/upload-logo',
         views.upload_logo, name='upload-logo'),
    path('<int:cca_id>/members/', views.CCAMembersView.as_view(), name='cca-members'),
    path('<int:cca_id>/training/',
         views.CCATrainingView.as_view(), name='cca-training'),
    path('<int:cca_id>/training/<int:session_id>/join/',
         views.join_training_session, name='join-training-session'),
    path('<int:cca_id>/training/<int:session_id>/leave/',
         views.leave_training_session, name='leave-training-session'),
    path('<int:cca_id>/announcement/',
         views.send_cca_announcement_view, name='send-announcement'),
]
