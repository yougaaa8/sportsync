from django.urls import path
from . import views

urlpatterns = [
    # Lobby endpoints
    path('lobbies/', views.LobbyListView.as_view(), name='lobby-list'),
    path('lobbies/create/', views.LobbyCreateView.as_view(), name='lobby-create'),
    path('lobbies/<int:id>/',
         views.LobbyDetailView.as_view(), name='lobby-detail'),
    path('lobbies/<int:id>/members/',
         views.LobbyMembersView.as_view(), name='lobby-members'),
    path('lobbies/<int:lobby_id>/members/<int:user_id>/',
         views.delete_member, name='delete-member'),
    path('lobbies/<int:id>/join/',
         views.join_lobby, name='join-lobby'),
    path('lobbies/<int:id>/leave/',
         views.leave_lobby, name='leave-lobby'),
]
