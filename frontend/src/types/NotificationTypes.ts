export interface Notification {
    id: number;
    title: string;
    message: string;
    notification_type: string;
    is_read: boolean;
    created_at: string;
    related_object_id: number | null;
    related_object_type: string | null;
}

export interface NotificationPreference {
    training_reminders: string;
    event_updates: string;
    matchmaking_updates: string;
    cca_announcements: string;
    tournament_updates: string;
    merch_updates: string;
}