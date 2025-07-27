from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from notifications.services import send_notification
from notifications.models import NotificationType


@shared_task
def send_tournament_announcement(tournament_id, title, message):
    """Send tournament announcement to all users"""
    from users.models import User

    try:
        users = User.objects.filter(is_active=True)

        for user in users:
            send_notification(
                recipient=user,
                title=title,
                message=message,
                notification_type=NotificationType.TOURNAMENT_UPDATE,
                related_object_id=tournament_id,
                related_object_type='tournament'
            )
        return f"Sent tournament announcement to {users.count()} users"
    except Exception as e:
        return f"Error: {str(e)}"


@shared_task
def send_tomorrow_matches_reminder():
    """Automatically send reminder for matches happening tomorrow - runs daily at 6 PM"""
    from users.models import User
    from .models import Match

    tomorrow = timezone.now().date() + timedelta(days=1)
    tomorrow_matches = Match.objects.filter(date__date=tomorrow)

    if not tomorrow_matches.exists():
        return "No matches tomorrow"

    users = User.objects.filter(is_active=True)
    match_list = []

    for match in tomorrow_matches:
        match_info = f"• {match.team1.name} vs {match.team2.name} at {match.date.strftime('%H:%M')}"
        if match.venue:
            match_info += f" ({match.venue})"
        match_list.append(match_info)

    message = f"Matches scheduled for tomorrow:\n\n" + "\n".join(match_list)

    for user in users:
        send_notification(
            recipient=user,
            title="Tomorrow's Matches",
            message=message,
            notification_type=NotificationType.TOURNAMENT_UPDATE,
            related_object_id=None,
            related_object_type='match_reminder'
        )

    return f"Sent tomorrow's matches reminder to {users.count()} users for {tomorrow_matches.count()} matches"
