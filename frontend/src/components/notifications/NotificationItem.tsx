import { Notification } from "../../types/NotificationTypes"
import { Paper, Button, Typography, Chip } from "@mui/material"
import markAsRead from "../../api-calls/notifications/markAsRead"

export default function NotificationItem({ notification }: { notification: Notification }) {

    // Define functions
    function markAsReadClick() {
        markAsRead(notification.id)
    }

    // Format the created date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Paper 
            elevation={1}
            className={`p-6 transition-all duration-200 border-l-4 ${
                notification.is_read 
                    ? 'border-l-gray-300 bg-white' 
                    : 'border-l-orange-500 bg-orange-50/30'
            }`}
        >
            <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <Typography 
                            variant="h6" 
                            component="h3"
                            className={`font-semibold truncate ${
                                notification.is_read ? 'text-gray-700' : 'text-gray-900'
                            }`}
                        >
                            {notification.title}
                        </Typography>
                        <Chip 
                            label={notification.is_read ? "Read" : "Unread"}
                            size="small"
                            color={notification.is_read ? "default" : "primary"}
                            variant={notification.is_read ? "outlined" : "filled"}
                            className="shrink-0"
                        />
                    </div>
                    
                    <Typography 
                        variant="body1" 
                        className={`mb-3 leading-relaxed ${
                            notification.is_read ? 'text-gray-600' : 'text-gray-800'
                        }`}
                    >
                        {notification.message}
                    </Typography>
                    
                    <Typography 
                        variant="caption" 
                        className="text-gray-500 block"
                    >
                        {formatDate(notification.created_at)}
                    </Typography>
                </div>
                
                {!notification.is_read && (
                    <Button 
                        variant="outlined" 
                        size="small"
                        onClick={markAsReadClick}
                        className="shrink-0 ml-2"
                    >
                        Mark as Read
                    </Button>
                )}
            </div>
        </Paper>
    )
}