from django.urls import path
from . import views

urlpatterns = [path('list/', views.TournamentListView.as_view(), name='tournament-list'),
               path('<int:tournament_id>/',
                    views.TournamentSportListView.as_view(), name='tournament-sport_list'),
               path('<int:tournament_id>/<int:sport_id>/teams/',
                    views.TeamListView.as_view(), name='team-list'),
               path('<int:tournament_id>/<int:sport_id>/teams/<int:team_id>/',
                    views.TeamMemberListView.as_view(), name='team-member-list'),
               path('<int:tournament_id>/<int:sport_id>/matches/',
                    views.MatchListView.as_view(), name='match-list')]
