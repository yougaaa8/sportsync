from django.contrib import admin
from .models import Tournament, TournamentSport, Team, TeamMember, Match

# Register your models here.
admin.site.register(Tournament)
admin.site.register(TournamentSport)
admin.site.register(Team)
admin.site.register(TeamMember)
admin.site.register(Match)
