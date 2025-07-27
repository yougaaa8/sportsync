from django.urls import path
from . import views

urlpatterns = [
    # Public list views
    path('list/', views.TournamentListView.as_view(), name='tournament-list'),
    path('<int:tournament_id>/',
         views.TournamentSportListView.as_view(), name='tournament-sport_list'),
    path('<int:tournament_id>/<int:sport_id>/teams/',
         views.TeamListView.as_view(), name='team-list'),
    path('<int:tournament_id>/<int:sport_id>/teams/<int:team_id>/',
         views.TeamMemberListView.as_view(), name='team-member-list'),
    path('<int:tournament_id>/<int:sport_id>/matches/',
         views.MatchListView.as_view(), name='match-list'),

    # Staff tournament manager
    path('create/', views.TournamentCreateView.as_view(), name='tournament-create'),
    path('<int:tournament_id>/edit/',
         views.TournamentEditView.as_view(), name='tournament-edit'),
    path('<int:tournament_id>/create/',
         views.TournamentSportCreateView.as_view(), name='tournament-sport-create'),
    path('<int:tournament_id>/<int:sport_id>/edit/',
         views.TournamentSportEditView.as_view(), name='tournament-sport-edit'),
    path('<int:tournament_id>/<int:sport_id>/teams/create/',
         views.TeamCreateView.as_view(), name='team-create'),
    path('<int:tournament_id>/<int:sport_id>/teams/<int:team_id>/edit/',
         views.TeamEditView.as_view(), name='team-edit'),
    path('<int:tournament_id>/<int:sport_id>/teams/<int:team_id>/create/',
         views.TeamMemberCreateView.as_view(), name='team-member-create'),
    path('<int:tournament_id>/<int:sport_id>/teams/<int:team_id>/<int:team_member_id>/edit/',
         views.TeamMemberEditView.as_view(), name='team-member-edit'),
    path('<int:tournament_id>/<int:sport_id>/matches/create/',
         views.MatchCreateView.as_view(), name='match-create'),
    path('<int:tournament_id>/<int:sport_id>/matches/<int:match_id>/edit/',
         views.MatchEditView.as_view(), name='match-edit'),
    path('<int:tournament_id>/announce/',
         views.send_tournament_announcement_view, name='tournament-announce'),
]
