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
  IconButton
} from "@mui/material"
import { 
  Person, 
  Event, 
  BookOnline, 
  ShoppingBag, 
  Edit,
  Save,
  Delete
} from "@mui/icons-material"
import updateProfile from "../../../api-calls/profile/updateProfile.js"
import { pullUserProfile } from "../../../api-calls/profile/pullUserProfile.js"
import deleteProfilePicture from "../../../api-calls/profile/deleteProfilePicture"

export default function Profile() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [status, setStatus] = useState("student")
    const [emergencyContact, setEmergencyContact] = useState("")
    const [bio, setBio] = useState("")
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

                </div>

                {/* Right Content */}
                <div className="w-full lg:w-2/3">
                    <Card>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
                                Profile Information
                            </Typography>
                            
                            {message && (
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        mb: 2, 
                                        p: 1, 
                                        bgcolor: message.includes('Error') ? 'error.50' : 'success.50',
                                        color: message.includes('Error') ? 'error.main' : 'success.main',
                                        borderRadius: 1
                                    }}
                                >
                                    {message}
                                </Typography>
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
                                        key={`first_name_${firstName}`} // Force re-render when firstName changes
                                        defaultValue={firstName}
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: Boolean(firstName), // Shrink label if there's a value
                                            },
                                        }}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="last_name"
                                        key={`last_name_${lastName}`} // Force re-render when lastName changes
                                        defaultValue={lastName}
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: Boolean(lastName), // Shrink label if there's a value
                                            },
                                        }}
                                    />
                                    
                                    <TextField
                                        fullWidth
                                        label="Status"
                                        name="status"
                                        key={`status_${status}`} // Force re-render when status changes
                                        defaultValue={status.charAt(0).toUpperCase() + status.slice(1)}
                                        variant="outlined"
                                        inputProps={{ readOnly: true }}
                                        slotProps={{
                                            inputLabel: {
                                                shrink: Boolean(status), // Shrink label if there's a value
                                            },
                                        }}
                                    >
                                    </TextField>
                                    
                                    <TextField
                                        fullWidth
                                        label="Emergency Contact"
                                        name="emergency_contact"
                                        key={`emergency_contact_${emergencyContact}`} // Force re-render when emergencyContact changes
                                        defaultValue={emergencyContact}
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: Boolean(emergencyContact), // Shrink label if there's a value
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
                                        key={`bio_${bio}`} // Force re-render when bio changes
                                        defaultValue={bio}
                                        variant="outlined"
                                        slotProps={{
                                            inputLabel: {
                                                shrink: Boolean(bio), // Shrink label if there's a value
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
                </div>
            </div>
        </Container>
    )
}