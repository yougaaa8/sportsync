"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import BlankProfilePicture from "../../../assets/blank-user-profile.jpg"
import { 
  Paper, 
  Container, 
  Grid, 
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
  IconButton
} from "@mui/material"
import { 
  Person, 
  Event, 
  BookOnline, 
  ShoppingBag, 
  Edit,
  Save
} from "@mui/icons-material"
import updateProfile from "../../../api-calls/profile/updateProfile.js"
import { pullUserProfile } from "../../../api-calls/profile/pullUserProfile.js"

export default function Profile() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState("student")
    const [emergencyContact, setEmergencyContact] = useState("")
    const [message, setMessage] = useState("")
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
                    setFirstName(data.first_name)
                    setLastName(data.last_name)
                    setStatus(data.status)
                    setEmergencyContact(data.emergency_contact)
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

    // 3) On form submit, PATCH the update endpoint to update the database
    async function handleSubmit(e) {
        e.preventDefault()
        // setMessage("")

        const token = localStorage.getItem("authToken");
        // Create a FormData to send in the upcoming PATCH request
        const formData = new FormData();
        formData.append("email", email)
        formData.append("first_name", firstName)
        formData.append("last_name", lastName)
        formData.append("status", status)
        formData.append("emergency_contact", emergencyContact)
        if (profilePicFile) {
            formData.append("profile_picture", profilePicFile)
        }
        updateProfile(formData)
    }

    const menuItems = [
        { text: 'Profile', icon: <Person />, active: true },
        { text: 'Events', icon: <Event /> },
        { text: 'Bookings', icon: <BookOnline /> },
        { text: 'Orders', icon: <ShoppingBag /> },
    ];

    const statusOptions = [
        { value: 'student', label: 'Student' },
        { value: 'staff', label: 'Staff' },
        { value: 'others', label: 'Others' },
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Grid container spacing={4}>
                {/* Left Sidebar */}
                <Grid item xs={12} md={4}>
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

                    {/* Navigation Menu */}
                    <Card>
                        <List disablePadding>
                            {menuItems.map((item, index) => (
                                <ListItem key={item.text} disablePadding>
                                    <ListItemButton 
                                        selected={item.active}
                                        sx={{
                                            py: 2,
                                            '&.Mui-selected': {
                                                bgcolor: 'primary.50',
                                                borderRight: '3px solid',
                                                borderRightColor: 'primary.main',
                                                '&:hover': {
                                                    bgcolor: 'primary.100',
                                                }
                                            }
                                        }}
                                    >
                                        <ListItemIcon sx={{ color: item.active ? 'primary.main' : 'text.secondary' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.text}
                                            sx={{ 
                                                '& .MuiListItemText-primary': { 
                                                    fontWeight: item.active ? 600 : 400,
                                                    color: item.active ? 'primary.main' : 'text.primary'
                                                }
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                {/* Right Content */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                Profile Information
                            </Typography>
                            
                            <Box 
                                component="form" 
                                onSubmit={handleSubmit}
                                encType="multipart/form-data"
                            >
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            value={firstName}
                                            onChange={e => setFirstName(e.target.value)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            value={lastName}
                                            onChange={e => setLastName(e.target.value)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            select
                                            label="Status"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            variant="outlined"
                                        >
                                            {statusOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Emergency Contact"
                                            value={emergencyContact}
                                            onChange={e => setEmergencyContact(e.target.value)}
                                            variant="outlined"
                                        />
                                    </Grid>
                                </Grid>
                                
                                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
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
                </Grid>
            </Grid>
        </Container>
    )
}