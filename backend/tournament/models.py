from django.db import models
from django.conf import settings


class Tournament(models.Model):
    name = models.TextField(max_length=100, unique=True)
    STATUS_CHOICE = [('upcoming', 'UPCOMING'), ("ongoing",
                                                "ONGOING"), ("completed", "COMPLETED")]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICE, default='upcoming')
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='tournament_logos', blank=True,
                             null=True, help_text="Upload a logo for the tournament")

    def __str__(self):
        return f"{self.name}"


class TournamentSport(models.Model):
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    sport = models.TextField(max_length=100)
    gender = models.CharField(
        max_length=10, choices=[('male', 'Male'), ('female', 'Female'), ('coed', 'Coed')])
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.sport} {self.gender[0].capitalize()} - {self.tournament.name}"


class Team(models.Model):
    name = models.TextField(max_length=100)
    tournament_sport = models.ForeignKey(
        TournamentSport, on_delete=models.CASCADE)
    logo = models.ImageField(upload_to='team_logos', blank=True,
                             null=True, help_text="Upload a logo for the team")
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} {self.tournament_sport.sport + ' ' + self.tournament_sport.gender[0].capitalize()} team - {self.tournament_sport.tournament.name}"


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    jersey_name = models.CharField(max_length=100)
    jersey_number = models.PositiveIntegerField()
    role = models.TextField(max_length=100)
    photo = models.ImageField(upload_to='team_members', blank=True,
                              null=True, help_text="Upload a photo for the team member")

    def __str__(self):
        return f"{self.jersey_name} {self.jersey_number} - {self.team.name}"


class Match(models.Model):
    tournament_sport = models.ForeignKey(
        TournamentSport, on_delete=models.CASCADE)
    team1 = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='team1_matches')
    team2 = models.ForeignKey(
        Team, on_delete=models.CASCADE, related_name='team2_matches')
    round = models.PositiveIntegerField()
    date = models.DateTimeField()
    venue = models.TextField(max_length=200, blank=True)
    score_team1 = models.PositiveIntegerField(default=0)
    score_team2 = models.PositiveIntegerField(default=0)
    winner = models.ForeignKey(
        Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='winner_team')
    match_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.team1.name} vs {self.team2.name} - {self.tournament_sport.tournament.name} {self.tournament_sport.sport + ' ' + self.tournament_sport.gender[0].capitalize()} Round {self.round}"
