"use client"
import { useState, useEffect } from "react"
import pullNotifications from "../../../api-calls/notifications/pullNotifications"
import pullNotificationPreferences from "../../../api-calls/notifications/pullNotificationPreferences"
import NotificationItem from "@/components/notifications/NotificationItem"
import { Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Chip } from "@mui/material"
import markAllAsRead from "../../../api-calls/notifications/markAllAsRead"
import { Notification, NotificationPreference } from "../../../types/NotificationTypes"
import pullNotificationCount from "../../../api-calls/notifications/pullNotificationCount"

export default function Notifications() {
    // Set states
    const [notifications, setNotifications] = useState<Notification[] | null>(null)
    const [notificationCount, setNotificationCount] = useState(0)
    const [isShowForm, setIsShowForm] = useState(false)

    // Get the notifications from the API
    useEffect(() => {
        const fetchNotifications = async () => {
            setNotifications((await pullNotifications()).results)
        }
        fetchNotifications()
    }, [])

    // Get the number of notifications from API
    useEffect(() => {
      const fetchNotificationCount = async () => {
        setNotificationCount((await pullNotificationCount()).unread_count)
      }
      fetchNotificationCount()
    }, [])

    // Map the notifications to NotificationItems
    const notificationList = notifications?.map((notification, index) => (
        <NotificationItem key={index} notification={notification}/>
    ))

    // Turn the notification preferences into a React component

    function markReadClick() {
        markAllAsRead()
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                {/* Header Section */}
                <Box 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        mb: 4,
                        pb: 3,
                        borderBottom: '1px solid',
                        borderColor: 'grey.200'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography 
                            variant="h2" 
                            component="h1"
                            sx={{ 
                                fontWeight: 600,
                                color: 'text.primary',
                                fontSize: { xs: '1.75rem', sm: '2rem' }
                            }}
                        >
                            Notifications
                        </Typography>
                        {notificationCount > 0 && (
                            <Chip 
                                label={`${notificationCount} unread`}
                                color="primary"
                                size="small"
                                sx={{ 
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}
                            />
                        )}
                    </Box>
                    
                    {notificationCount > 0 && (
                        <Button 
                            variant="contained" 
                            color="primary"
                            onClick={markReadClick}
                            size="medium"
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                textTransform: 'none',
                                boxShadow: 'none',
                                '&:hover': {
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.25)'
                                }
                            }}
                        >
                            Mark All as Read
                        </Button>
                    )}
                </Box>

                {/* Notifications List */}
                <Box sx={{ mt: 3 }}>
                    {notifications && notifications.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {notificationList}
                        </Box>
                    ) : (
                        <Box 
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 8,
                                px: 3,
                                backgroundColor: 'grey.50',
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}
                        >
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: 'text.secondary',
                                    fontWeight: 500,
                                    mb: 1
                                }}
                            >
                                All caught up!
                            </Typography>
                            <Typography 
                                variant="body2" 
                                sx={{ 
                                    color: 'text.secondary',
                                    textAlign: 'center'
                                }}
                            >
                                No new notifications at the moment
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    )
}