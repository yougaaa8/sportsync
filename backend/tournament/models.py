from django.db import models
from django.conf import settings
from cloudinary.models import CloudinaryField
from cloudinary.uploader import destroy


class Tournament(models.Model):
    name = models.TextField(max_length=100, unique=True)
    STATUS_CHOICE = [('upcoming', 'UPCOMING'), ("ongoing",
                                                "ONGOING"), ("completed", "COMPLETED")]
    status = models.CharField(
        max_length=10, choices=STATUS_CHOICE, default='upcoming')
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    logo = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/tournament_logo/',
        transformation={
            'width': 300,
            'height': 300,
            'crop': 'fill',
            'gravity': 'face',
            'quality': 'auto',
            'fetch_format': 'auto'
        },
        help_text="Upload a tournament logo"
    )

    def __str__(self):
        return f"{self.name}"

    def delete_old_logo(self):
        if self.logo:
            try:
                destroy(self.logo.public_id)
            except Exception as e:
                print(f"Error deleting old tournament logo: {e}")


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
    logo = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/team_logo/',
        transformation={
            'width': 300,
            'height': 300,
            'crop': 'fill',
            'gravity': 'face',
            'quality': 'auto',
            'fetch_format': 'auto'
        },
        help_text="Upload a team logo"
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} {self.tournament_sport.sport + ' ' + self.tournament_sport.gender[0].capitalize()} team - {self.tournament_sport.tournament.name}"

    def delete_old_logo(self):
        if self.logo:
            try:
                destroy(self.logo.public_id)
            except Exception as e:
                print(f"Error deleting old team logo: {e}")


class TeamMember(models.Model):
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    jersey_name = models.CharField(max_length=100)
    jersey_number = models.PositiveIntegerField()
    role = models.TextField(max_length=100)
    photo = CloudinaryField(
        'image',
        blank=True,
        null=True,
        folder='sportsync/team_member_photo/',
        transformation={
            'width': 400,
            'height': 400,
            'crop': 'fill',
            'gravity': 'face',
            'quality': 'auto',
            'fetch_format': 'auto'
        },
        help_text="Upload a team member photo"
    )

    def __str__(self):
        return f"{self.jersey_name} {self.jersey_number} - {self.team.name}"

    def delete_old_photo(self):
        if self.photo:
            try:
                destroy(self.photo.public_id)
            except Exception as e:
                print(f"Error deleting old team member photo: {e}")


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
