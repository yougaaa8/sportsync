"use client"

import { useState, useEffect } from "react";
import { 
    Box, 
    Button, 
    TextField, 
    Typography, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    IconButton,
    Divider,
    Card,
    CardContent,
    Snackbar
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import pullEventDetails from "../../../../api-calls/events/pullEventDetails"
import pullEventParticipants from  "../../../../api-calls/events/pullEventParticipants"
import pullUserProfileFromEmail from "@/api-calls/profile/pullUserProfileFromEmail";
import editEventDetails from "../../../../api-calls/events/editEventDetails"
import notifyEventParticipants from "../../../../api-calls/events/notifyEventParticipants"
import { Event, EventParticipant } from "../../../../types/EventTypes"
import EventRegistrationButton from "../../../../components/events/EventRegistrationButton.jsx"
import EventLeaveButton from "../../../../components/events/EventLeaveButton.jsx"
import EventParticipantTable from "../../../../components/events/EventParticipantTable.jsx"
import Alert from '@mui/material/Alert';

export default function EventDetailPage({params}: {
    params: Promise<{
        eventId: string
    }>
}) {
    // Set state(s)
    const [eventDetails, setEventDetails] = useState<Event | null>(null);
    const [eventParticipants, setEventParticipants] = useState<EventParticipant | null>(null);
    const [userRole, setUserRole] = useState("")
    const [isShowEventForm, setIsShowEventForm] = useState(false)
    const [adminEmailFields, setAdminEmailFields] = useState<number[]>([0])
    const [selectedFileName, setSelectedFileName] = useState<string>("")
    const [notifySuccess, setNotifySuccess] = useState(false);

    // Helper function to format date
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    // Handle file selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFileName(file ? file.name : "");
    };

    // Resolve params and extract event details
    useEffect(() => {
        const resolveParams = async () => {
            const resolvedParams = await params
            const eventId = parseInt(resolvedParams.eventId)
            setEventDetails(await pullEventDetails(eventId))
            setEventParticipants(await pullEventParticipants(eventId))
        }
        resolveParams()
    }, [params])

    // Extract the user's role from local storage
    useEffect(() => {
        const fetchRole = async () => {
            if (typeof window !== "undefined") {
                const role = localStorage.getItem("role")
                if (role) {
                    setUserRole(role)
                }
            }
        }
        fetchRole()
    }, [])

    function addAdminEmailField() {
        setAdminEmailFields(prev => [...prev, Date.now()])
    }

    function removeAdminEmailField(idx: number) {
        setAdminEmailFields(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)
    }

    async function handleEventManagement(formData: FormData) {
        // Turn the array of admin fields into an array of user ids
        const adminEmails = formData.getAll("admins[]").filter(email => !!email && String(email).trim() !== "");
        const adminIds = (
          await Promise.all(
            adminEmails.map(async email => {
              const user = await pullUserProfileFromEmail(email);
              return user?.user_id;
            })
          )
        ).filter(id => id !== undefined && id !== null && id !== "");

        formData.delete("admins[]");
        adminIds.forEach((id: number | string) => {
          formData.append("admins", String(id));
        });

        // Pass the form data to the edit event API
        await editEventDetails(formData, eventDetails?.id)

        // Reload after editing the event detail backend
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    // Create the admin email input
    const adminEmailInputList = adminEmailFields.map((field, idx) => (
        <Box key={field} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <TextField
                name="admins[]"
                variant="outlined"
                size="small"
                placeholder="Enter admin email"
                fullWidth
                sx={{ flex: 1 }}
            />
            {adminEmailFields.length > 1 && (
                <IconButton 
                    onClick={() => removeAdminEmailField(idx)}
                    size="small"
                    color="error"
                    sx={{ 
                        bgcolor: 'error.50', 
                        '&:hover': { bgcolor: 'error.100' },
                        minWidth: 36,
                        height: 36
                    }}
                >
                    <RemoveIcon fontSize="small" />
                </IconButton>
            )}
            {idx === adminEmailFields.length - 1 && (
                <IconButton 
                    onClick={addAdminEmailField}
                    size="small"
                    color="primary"
                    sx={{ 
                        bgcolor: 'primary.50', 
                        '&:hover': { bgcolor: 'primary.100' },
                        minWidth: 36,
                        height: 36
                    }}
                >
                    <AddIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    ))

    async function handleNotifyParticipants(formData: FormData) {
        await notifyEventParticipants(formData, eventDetails?.id);
        setNotifySuccess(true);
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-12">
                        <div className="text-center">
                            <h1 className="text-3xl font-semibold mb-3">
                                {eventDetails?.name}
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-orange-100">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-base font-medium">
                                    {eventDetails?.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 py-8">
                        {/* Event Poster */}
                        {eventDetails?.poster_url && (
                            <div className="flex justify-center mb-8">
                                <img 
                                    src={eventDetails.poster_url}
                                    alt={`${eventDetails.name} poster`}
                                    className="max-w-full h-auto rounded-xl shadow-lg border border-gray-200 max-h-96 object-cover"
                                />
                            </div>
                        )}
                        {/* Event Description */}
                        {eventDetails?.description && (
                            <div className="text-center mb-10">
                                <p className="text-lg text-gray-600">
                                    {eventDetails.description}
                                </p>
                            </div>
                        )}

                        {/* Event Details - Clean Professional Layout */}
                        <div className="space-y-8 mb-10">
                            {/* Date and Registration Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Event Date */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Event Date
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails? formatDate(eventDetails?.date) : null}
                                        </p>
                                    </div>
                                </div>

                                {/* Registration Deadline */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Registration Deadline
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails? formatDate(eventDetails?.registration_deadline) : null}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Participants and Fee Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Participants */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Participants
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-gray-700 font-medium">
                                                {eventDetails?.participants_count} registered
                                            </p>
                                            <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                                                {eventDetails?.participants_count}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Organization Info Row */}
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Organizer */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Organizer
                                            </h3>
                                        </div>
                                        <p className="text-gray-700 font-medium">
                                            {eventDetails?.organizer}
                                        </p>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="flex-1">
                                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                                        <div className="flex items-center gap-3 mb-3">
                                            <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                                Contact
                                            </h3>
                                        </div>
                                        <a 
                                            href={`mailto:${eventDetails?.contact_point}`}
                                            className="text-orange-600 font-medium hover:text-orange-700 hover:underline transition-colors"
                                        >
                                            {eventDetails?.contact_point}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-gray-200">
                            <EventRegistrationButton 
                                event={eventDetails}
                                className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-white bg-orange-600 hover:bg-orange-700 transition-colors duration-200"
                            >
                                Register for Event
                            </EventRegistrationButton>
                            <EventLeaveButton 
                                event={eventDetails}
                                className="w-full sm:w-auto border border-orange-600 text-orange-600 px-8 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors duration-200">
                                Leave Event
                            </EventLeaveButton>
                        </div>
                    </div>

                    {userRole === "staff" &&
                    <EventParticipantTable participants={eventParticipants}/>}

                    {/* Management Section */}
                    <Box sx={{ px: 4, pb: 4 }}>
                        <Divider sx={{ my: 3 }} />
                        
                        <Button 
                            onClick={() => setIsShowEventForm(prev => !prev)}
                            variant="outlined"
                            size="large"
                            sx={{ 
                                mb: 3,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5
                            }}
                        >
                            {isShowEventForm ? 'Hide Event Management' : 'Manage Event Details'}
                        </Button>

                        {isShowEventForm && (
                            <Card sx={{ 
                                boxShadow: 2, 
                                borderRadius: 3,
                                border: '1px solid',
                                borderColor: 'grey.200'
                            }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h5" sx={{ 
                                        mb: 3, 
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        textAlign: 'center'
                                    }}>
                                        Event Management
                                    </Typography>
                                    
                                    <Box component="form" action={handleEventManagement}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                            {/* Basic Information Section */}
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    mb: 2, 
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Basic Information
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                    <TextField
                                                        name="name"
                                                        label="Event Name"
                                                        defaultValue={eventDetails?.name}
                                                        variant="outlined"
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        name="description"
                                                        label="Event Description"
                                                        defaultValue={eventDetails?.description}
                                                        multiline
                                                        rows={3}
                                                        variant="outlined"
                                                        fullWidth
                                                    />

                                                    <TextField
                                                        name="location"
                                                        defaultValue={eventDetails?.location}
                                                        label="Location"
                                                        variant="outlined"
                                                        fullWidth
                                                    />
                                                </Box>
                                            </Box>

                                            <Divider />

                                            {/* Date and Time Section */}
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    mb: 2, 
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Date & Time
                                                </Typography>
                                                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                    <TextField
                                                        name="date"
                                                        label="Event Date"
                                                        type="date"
                                                        defaultValue={eventDetails?.date}
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        InputLabelProps={{ shrink: true }}
                                                    />

                                                    <TextField
                                                        name="registration_deadline"
                                                        label="Registration Deadline"
                                                        type="date"
                                                        defaultValue={eventDetails?.registration_deadline}
                                                        variant="outlined"
                                                        fullWidth
                                                        required
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Divider />

                                            {/* Administrative Section */}
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    mb: 2, 
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Administrative Settings
                                                </Typography>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                                                    <TextField
                                                        name="cca"
                                                        label="CCA ID (Optional)"
                                                        variant="outlined"
                                                        fullWidth
                                                        helperText="Leave empty if not associated with a CCA"
                                                    />

                                                    <Box>
                                                        <Typography variant="body2" sx={{ 
                                                            mb: 1.5, 
                                                            fontWeight: 600,
                                                            color: 'text.primary'
                                                        }}>
                                                            Admin Emails (Optional)
                                                        </Typography>
                                                        {adminEmailInputList}
                                                        <Typography variant="caption" sx={{ 
                                                            color: 'text.secondary',
                                                            mt: 0.5,
                                                            display: 'block'
                                                        }}>
                                                            Add email addresses of users who should have admin access to this event
                                                        </Typography>
                                                    </Box>

                                                    <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                                        <FormControl fullWidth>
                                                            <InputLabel>Visibility</InputLabel>
                                                            <Select
                                                                name="public"
                                                                defaultValue="true"
                                                                label="Visibility"
                                                            >
                                                                <MenuItem value="true">Public</MenuItem>
                                                                <MenuItem value="false">Private</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                        <TextField
                                                            name="max_participants"
                                                            label="Max Participants"
                                                            type="number"
                                                            variant="outlined"
                                                            fullWidth
                                                            helperText="Leave empty for unlimited"
                                                        />
                                                    </Box>

                                                    <TextField
                                                        name="contact_point"
                                                        label="Contact Information"
                                                        variant="outlined"
                                                        fullWidth
                                                        helperText="Email or phone number for event inquiries"
                                                    />
                                                </Box>
                                            </Box>

                                            {/* Event Poster Upload Section */}
                                            <Box>
                                                <Typography variant="h6" sx={{ 
                                                    mb: 2, 
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem'
                                                }}>
                                                    Event Poster
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        border: '2px dashed',
                                                        borderColor: 'grey.300',
                                                        borderRadius: 2,
                                                        p: 3,
                                                        textAlign: 'center',
                                                        transition: 'all 0.2s ease-in-out',
                                                        cursor: 'pointer',
                                                        bgcolor: 'grey.50',
                                                        '&:hover': {
                                                            borderColor: 'primary.main',
                                                            bgcolor: 'primary.50',
                                                        },
                                                        '&:has(input:focus)': {
                                                            borderColor: 'primary.main',
                                                            bgcolor: 'primary.50',
                                                        }
                                                    }}
                                                    component="label"
                                                >
                                                    <input
                                                        name="poster"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            opacity: 0,
                                                            cursor: 'pointer',
                                                        }}
                                                    />
                                                    <Box sx={{ 
                                                        display: 'flex', 
                                                        flexDirection: 'column', 
                                                        alignItems: 'center',
                                                        gap: 1
                                                    }}>
                                                        <CloudUploadIcon 
                                                            sx={{ 
                                                                fontSize: 48, 
                                                                color: selectedFileName ? 'primary.main' : 'grey.400',
                                                                transition: 'color 0.2s'
                                                            }} 
                                                        />
                                                        <Typography 
                                                            variant="body1" 
                                                            sx={{ 
                                                                fontWeight: 600,
                                                                color: selectedFileName ? 'primary.main' : 'text.primary'
                                                            }}
                                                        >
                                                            {selectedFileName || 'Click to upload event poster'}
                                                        </Typography>
                                                        <Typography 
                                                            variant="caption" 
                                                            sx={{ color: 'text.secondary' }}
                                                        >
                                                            Supports JPG, PNG, GIF up to 10MB
                                                        </Typography>
                                                        {selectedFileName && (
                                                            <Typography 
                                                                variant="body2" 
                                                                sx={{ 
                                                                    color: 'success.main',
                                                                    mt: 1,
                                                                    fontWeight: 500
                                                                }}
                                                            >
                                                                ✓ File selected: {selectedFileName}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Box>
                                            </Box>

                                            <Divider />

                                            {/* Submit Button */}
                                            <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                                                <Button 
                                                    type="submit"
                                                    variant="contained"
                                                    size="large"
                                                    sx={{ 
                                                        px: 6,
                                                        py: 1.5,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        fontWeight: 600,
                                                        fontSize: '1rem'
                                                    }}
                                                >
                                                    Update Event Details
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        )}
                    </Box>

                    {/* Notify Participants Form */}
                    <Box sx={{ px: 4, pb: 4, mt: 4 }}>
                        <Card sx={{ 
                            boxShadow: 1, 
                            borderRadius: 3,
                            border: '1px solid',
                            borderColor: 'grey.200',
                            maxWidth: 500,
                            mx: 'auto',
                            mb: 4,
                            bgcolor: 'grey.50'
                        }}>
                            <CardContent>
                                <Typography variant="h6" sx={{ 
                                    mb: 2, 
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    textAlign: 'center'
                                }}>
                                    Notify Event Participants
                                </Typography>
                                <Box
                                    component="form"
                                    action={handleNotifyParticipants}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                                >
                                    <TextField
                                        name="title"
                                        label="Notification Title"
                                        variant="outlined"
                                        fullWidth
                                        placeholder={`Update for ${eventDetails?.name}`}
                                    />
                                    <TextField
                                        name="message"
                                        label="Message"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        multiline
                                        rows={3}
                                        placeholder="Enter your message to all participants"
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{
                                            mt: 1,
                                            px: 4,
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            alignSelf: 'center'
                                        }}
                                    >
                                        Notify Event Participants
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Success Snackbar */}
                    <Snackbar
                        open={notifySuccess}
                        autoHideDuration={4000}
                        onClose={() => setNotifySuccess(false)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={() => setNotifySuccess(false)} severity="success" sx={{ width: '100%' }}>
                            Notification sent to all participants!
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </div>
    );
}