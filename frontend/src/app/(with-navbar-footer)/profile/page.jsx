"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import BlankProfilePicture from "../../../assets/blank-user-profile.jpg"
import { 
  Paper, 
  Container, 
  Avatar, 
  Button, 
  TextField, 
  MenuItem, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Alert
} from "@mui/material"
import { 
  Person, 
  Event, 
  BookOnline, 
  ShoppingBag, 
  Edit,
  Save,
  Delete,
  Notifications,
  AccountCircle
} from "@mui/icons-material"
import updateProfile from "../../../api-calls/profile/updateProfile.js"
import { pullUserProfile } from "../../../api-calls/profile/pullUserProfile.js"
import deleteProfilePicture from "../../../api-calls/profile/deleteProfilePicture"
import pullNotificationPreferences from "@/api-calls/notifications/pullNotificationPreferences"
import updateNotificationPreferences from "../../../api-calls/notifications/updateNotificationPreferences"

export default function Profile() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState("student")
    const [emergencyContact, setEmergencyContact] = useState("")
    const [bio, setBio] = useState("")
    const [message, setMessage] = useState("")
    const [notificationPreferences, setNotificationPreferences] = useState(null)
    const [activeTab, setActiveTab] = useState("profile")
    const [notificationMessage, setNotificationMessage] = useState("")
    const router = useRouter(); 

    // Variables for profile picture upload
    const [profilePicPreview, setProfilePicPreview] = useState(null)
    const [profilePicFile, setProfilePicFile] = useState(null)
    const fileInputRef = useRef(null);

    // 1) On mount, load the current profile
    useEffect(() => {
        pullUserProfile()
              .then(res => res.json())
              .then(data => {
                    console.log(data)
                    setFirstName(data.first_name || "")
                    setLastName(data.last_name || "")
                    setStatus(data.status || "student")
                    setEmergencyContact(data.emergency_contact || "")
                    setBio(data.bio || "")
                    // get existing profile picture if available
                    if (data.profile_picture_url) { 
                        setProfilePicPreview(data.profile_picture_url)
                        console.log("Profile picture changed")
                    }
                        
                })
              .catch(console.error)
    }, [])

    // 2) Function to handle file selection
    function handleFileChange(e) {
        const file = e.target.files[0]
        if (file) {
            setProfilePicFile(file)
            setProfilePicPreview(URL.createObjectURL(file))
        }
    }

    // Function to handle profile picture deletion
    function handleDeleteProfilePicture() {
        deleteProfilePicture()
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    // 3) Form action for React 19
    async function handleSubmit(formData) {
        try {
            // If there's a profile picture file, append it to formData
            if (profilePicFile) {
                formData.append('profile_picture', profilePicFile)
            }
            
            const result = await updateProfile(formData)
            localStorage.setItem("role", formData.get("status"))
            setMessage("Profile updated successfully!")
        } catch (error) {
            console.error('Error updating profile:', error)
            setMessage("Error updating profile. Please try again.")
        }
    }

    // Function to update notification preferences
    async function handleNotificationPreferences(formData) {
        try {
            await updateNotificationPreferences(formData)
            setNotificationMessage("Notification preferences updated successfully!")
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error) {
            console.error('Error updating notification preferences:', error)
            setNotificationMessage("Error updating notification preferences. Please try again.")
        }
    }
    
    // Pull the notification preferences to set as default values
    // for the update notification form
    useEffect(() => {
        const fetchNotificationPreferences = async () => {
            setNotificationPreferences(await pullNotificationPreferences())
        }
        fetchNotificationPreferences()
    }, [])

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Sidebar */}
                <div className="w-full lg:w-1/3">
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ textAlign: 'center', p: 4 }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                                <Avatar
                                    src={profilePicPreview || BlankProfilePicture}
                                    sx={{ 
                                        width: 120, 
                                        height: 120, 
                                        mx: 'auto',
                                        border: '4px solid',
                                        borderColor: 'grey.100'
                                    }}
                                />
                                <IconButton
                                    sx={{ 
                                        position: 'absolute', 
                                        bottom: -8, 
                                        right: -8,
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'primary.dark' },
                                        boxShadow: 2
                                    }}
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                                {/* Delete Profile Picture Button - Only show if there's a profile picture */}
                                {(profilePicPreview && profilePicPreview !== BlankProfilePicture) && (
                                    <IconButton
                                        sx={{ 
                                            position: 'absolute', 
                                            bottom: -8, 
                                            left: -8,
                                            bgcolor: 'error.main',
                                            color: 'white',
                                            '&:hover': { bgcolor: 'error.dark' },
                                            boxShadow: 2
                                        }}
                                        onClick={handleDeleteProfilePicture}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                )}
                                <input 
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                />
                            </Box>
                            
                            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                {`${firstName} ${lastName}` || "Guest"}
                            </Typography>
                            
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ 
                                    textTransform: 'capitalize',
                                    bgcolor: 'grey.100',
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: 2,
                                    display: 'inline-block'
                                }}
                            >
                                {status}
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Navigation Card */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent sx={{ p: 2 }}>
                            <List sx={{ p: 0 }}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={activeTab === "profile"}
                                        onClick={() => setActiveTab("profile")}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                                '& .MuiListItemIcon-root': {
                                                    color: 'white',
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <AccountCircle />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Profile Information" 
                                            sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        selected={activeTab === "notifications"}
                                        onClick={() => setActiveTab("notifications")}
                                        sx={{
                                            borderRadius: 2,
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                                '& .MuiListItemIcon-root': {
                                                    color: 'white',
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Notifications />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary="Notification Settings" 
                                            sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Content */}
                <div className="w-full lg:w-2/3">
                    {activeTab === "profile" && (
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                    Profile Information
                                </Typography>
                                
                                {message && (
                                    <Alert 
                                        severity={message.includes('Error') ? 'error' : 'success'}
                                        sx={{ mb: 3 }}
                                    >
                                        {message}
                                    </Alert>
                                )}
                                
                                <Box 
                                    component="form" 
                                    action={handleSubmit}
                                    encType="multipart/form-data"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            name="first_name"
                                            key={`first_name_${firstName}`}
                                            defaultValue={firstName}
                                            variant="outlined"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: Boolean(firstName),
                                                },
                                            }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            name="last_name"
                                            key={`last_name_${lastName}`}
                                            defaultValue={lastName}
                                            variant="outlined"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: Boolean(lastName),
                                                },
                                            }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            label="Status"
                                            name="status"
                                            key={`status_${status}`}
                                            defaultValue={status.charAt(0).toUpperCase() + status.slice(1)}
                                            variant="outlined"
                                            inputProps={{ readOnly: true }}
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: Boolean(status),
                                                },
                                            }}
                                        />
                                        
                                        <TextField
                                            fullWidth
                                            label="Emergency Contact"
                                            name="emergency_contact"
                                            key={`emergency_contact_${emergencyContact}`}
                                            defaultValue={emergencyContact}
                                            variant="outlined"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: Boolean(emergencyContact),
                                                },
                                            }}
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Bio"
                                            name="bio"
                                            key={`bio_${bio}`}
                                            defaultValue={bio}
                                            variant="outlined"
                                            slotProps={{
                                                inputLabel: {
                                                    shrink: Boolean(bio),
                                                },
                                            }}
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    minHeight: '120px'
                                                }
                                            }}
                                        />
                                    </div>
                                    
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            size="large"
                                            startIcon={<Save />}
                                            sx={{ 
                                                minWidth: 140,
                                                py: 1.5
                                            }}
                                        >
                                            Save Changes
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "notifications" && notificationPreferences && (
                        <Card>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                    Notification Settings
                                </Typography>

                                {notificationMessage && (
                                    <Alert 
                                        severity={notificationMessage.includes('Error') ? 'error' : 'success'}
                                        sx={{ mb: 3 }}
                                    >
                                        {notificationMessage}
                                    </Alert>
                                )}
                                
                                <Box component="form" action={handleNotificationPreferences}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Training Reminders</InputLabel>
                                            <Select
                                                name="training_reminders"
                                                defaultValue={notificationPreferences?.training_reminders}
                                                label="Training Reminders"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Event Updates</InputLabel>
                                            <Select
                                                name="event_updates"
                                                defaultValue={notificationPreferences?.event_updates}
                                                label="Event Updates"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Matchmaking Updates</InputLabel>
                                            <Select
                                                name="matchmaking_updates"
                                                defaultValue={notificationPreferences?.matchmaking_updates}
                                                label="Matchmaking Updates"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>CCA Announcements</InputLabel>
                                            <Select
                                                name="cca_announcements"
                                                defaultValue={notificationPreferences?.cca_announcements}
                                                label="CCA Announcements"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Tournament Updates</InputLabel>
                                            <Select
                                                name="tournament_updates"
                                                defaultValue={notificationPreferences?.tournament_updates}
                                                label="Tournament Updates"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel shrink>Merchandise Updates</InputLabel>
                                            <Select
                                                name="merch_updates"
                                                defaultValue={notificationPreferences?.merch_updates}
                                                label="Merchandise Updates"
                                                notched
                                            >
                                                <MenuItem value="in_app">In-App Only</MenuItem>
                                                <MenuItem value="email">Email Only</MenuItem>
                                                <MenuItem value="both">Both</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>

                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button 
                                            type="submit" 
                                            variant="contained" 
                                            size="large"
                                            startIcon={<Save />}
                                            sx={{ 
                                                minWidth: 180,
                                                py: 1.5
                                            }}
                                        >
                                            Save Preferences
                                        </Button>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Container>
    )
}