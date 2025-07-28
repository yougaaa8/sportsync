"use client"
import { useState, useEffect } from "react"
import pullNotifications from "../../../api-calls/notifications/pullNotifications"
import pullNotificationPreferences from "../../../api-calls/notifications/pullNotificationPreferences"
import NotificationItem from "@/components/notifications/NotificationItem"
import { Button, Container, Typography, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import markAllAsRead from "../../../api-calls/notifications/markAllAsRead"
import { Notification, NotificationPreference } from "../../../types/NotificationTypes"

export default function Notifications() {
    // Set states
    const [notifications, setNotifications] = useState<Notification[] | null>(null)
    const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference | null>(null)
    const [isShowForm, setIsShowForm] = useState(false)

    // Get the notifications from the API
    useEffect(() => {
        const fetchNotifications = async () => {
            setNotifications((await pullNotifications()).results)
        }
        fetchNotifications()
    }, [])

    // Get notification preferences from the API
    useEffect(() => {
        const fetchNotificationPreferences = async () => {
            setNotificationPreferences(await pullNotificationPreferences())
        }
        fetchNotificationPreferences()
    }, [])

    // Map the notifications to NotificationItems
    const notificationList = notifications?.map((notification, index) => (
        <NotificationItem key={index} notification={notification}/>
    ))

    // Turn the notification preferences into a React component

    function markReadClick() {
        markAllAsRead()
    }

    function ManagePreferencesClick() {
        
    }
    
    return (
        <Container maxWidth="md" className="py-8">
            <Box className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <Typography 
                        variant="h2" 
                        component="h1"
                        className="font-semibold text-gray-900"
                    >
                        Notifications
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary"
                        onClick={markReadClick}
                        className="shadow-sm"
                    >
                        Mark All as Read
                    </Button>
                </div>

                <Button onClick={() => setIsShowForm(prev => !prev)}>
                    {isShowForm ? "Close Form" : "Change Notification Preferences"}
                </Button>
                {isShowForm && (
                  <Box
                    component="form"
                    onSubmit={ManagePreferencesClick}
                    className="bg-white rounded-lg shadow p-6 my-6 flex flex-col gap-6 max-w-2xl"
                  >
                    <Typography variant="h5" className="font-semibold mb-2 text-gray-900">
                      Notification Preferences
                    </Typography>
                    <div className="flex flex-wrap gap-6">
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="training-reminders-label">Training Reminders</InputLabel>
                        <Select
                          labelId="training-reminders-label"
                          defaultValue={notificationPreferences?.training_reminders || ""}
                          label="Training Reminders"
                          name="training_reminders"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="event-updates-label">Event Updates</InputLabel>
                        <Select
                          labelId="event-updates-label"
                          defaultValue={notificationPreferences?.event_updates || ""}
                          label="Event Updates"
                          name="event_updates"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="matchmaking-updates-label">Matchmaking Updates</InputLabel>
                        <Select
                          labelId="matchmaking-updates-label"
                          defaultValue={notificationPreferences?.matchmaking_updates || ""}
                          label="Matchmaking Updates"
                          name="matchmaking_updates"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="cca-announcements-label">CCA Announcements</InputLabel>
                        <Select
                          labelId="cca-announcements-label"
                          defaultValue={notificationPreferences?.cca_announcements || ""}
                          label="CCA Announcements"
                          name="cca_announcements"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="tournament-updates-label">Tournament Updates</InputLabel>
                        <Select
                          labelId="tournament-updates-label"
                          defaultValue={notificationPreferences?.tournament_updates || ""}
                          label="Tournament Updates"
                          name="tournament_updates"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl className="min-w-[200px] flex-1">
                        <InputLabel id="merch-updates-label">Merchandise Updates</InputLabel>
                        <Select
                          labelId="merch-updates-label"
                          defaultValue={notificationPreferences?.merch_updates || ""}
                          label="Merchandise Updates"
                          name="merch_updates"
                        >
                          <MenuItem value="in_app">In-App</MenuItem>
                          <MenuItem value="email">Email</MenuItem>
                          <MenuItem value="both">Both</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="flex justify-end mt-4">
                      <Button type="submit" variant="contained" color="primary">
                        Save Preferences
                      </Button>
                    </div>
                  </Box>
                )}
                
                <div className="space-y-3">
                    {notifications && notifications.length > 0 ? (
                        notificationList
                    ) : (
                        <div className="text-center py-12">
                            <Typography 
                                variant="body1" 
                                color="textSecondary"
                                className="text-gray-500"
                            >
                                No notifications found
                            </Typography>
                        </div>
                    )}
                </div>
            </Box>
        </Container>
    )
}