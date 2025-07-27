"use client"

import { useState, useEffect } from "react"
import { Container, Typography, Box, Fab } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import EventItem from "../../../components/events/EventItem.jsx"
import { pullEventsData } from "../../../api-calls/events/pullEventsData.js"
import { Event } from "../../../types/EventTypes.js"

export default function EventList() {
    // Create state to store array of JSX event objects
    const [events, setEvents] = useState<Event[] | null>([])
    const [token, setToken] = useState("")

    // Get token after component mounts
    useEffect(() => {
        if (typeof window) {
            const authToken = localStorage.getItem("authToken")
            if (authToken) {
                setToken(authToken)
            }
        }
    }, [])

    // Fetch the events from the backend
    useEffect(() => {
        const fetchEvents = async () => {
            setEvents(await pullEventsData())
        };
        fetchEvents();
    }, [token]);

    // Create const to store the array of JSX event elements
    const eventElements = events?.map(event => (
        <EventItem key={event.id} event={event}/>
    ))
    
    return (
        <Box sx={{ 
            minHeight: '100vh',
            bgcolor: '#f8fafc',
            py: 6
        }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            mb: 2,
                            color: '#1f2937',
                            fontWeight: 700,
                            letterSpacing: '-0.025em',
                            fontSize: { xs: '2rem', md: '3rem' }
                        }}
                    >
                        Upcoming Events
                    </Typography>
                    <Box sx={{ 
                        width: 60, 
                        height: 3, 
                        backgroundColor: '#ea580c',
                        mx: 'auto',
                        borderRadius: 1.5,
                        mb: 3
                    }} />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#6b7280',
                            maxWidth: 600, 
                            mx: 'auto', 
                            fontSize: '1.125rem',
                            fontWeight: 400,
                            lineHeight: 1.6
                        }}
                    >
                        Discover and join exciting sports events happening at NUS
                    </Typography>
                </Box>

                {/* Events Container */}
                {events && events.length > 0 ? (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)'
                        },
                        gap: 4,
                        mb: 8
                    }}>
                        {eventElements}
                    </Box>
                ) : (
                    /* Empty State */
                    <Box sx={{ 
                        textAlign: 'center', 
                        py: 12,
                        px: 4
                    }}>
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            bgcolor: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 4
                        }}>
                            <Typography sx={{ fontSize: '3rem', color: '#9ca3af' }}>
                                📅
                            </Typography>
                        </Box>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 2,
                                color: '#374151',
                                fontWeight: 600
                            }}
                        >
                            No events scheduled yet
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                color: '#6b7280',
                                maxWidth: 400,
                                mx: 'auto',
                                lineHeight: 1.6
                            }}
                        >
                            Be the first to create an exciting sports event for the NUS community!
                        </Typography>
                    </Box>
                )}

                {/* Floating Action Button */}
                <Fab
                    color="primary"
                    size="large"
                    href="/events/form"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        bgcolor: '#ea580c',
                        width: 64,
                        height: 64,
                        boxShadow: '0 10px 25px -5px rgba(234, 88, 12, 0.25), 0 4px 10px -2px rgba(234, 88, 12, 0.1)',
                        '&:hover': {
                            bgcolor: '#dc2626',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 20px 35px -5px rgba(234, 88, 12, 0.35), 0 8px 15px -2px rgba(234, 88, 12, 0.15)',
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 1000
                    }}
                >
                    <AddIcon sx={{ fontSize: 28, color: 'white' }} />
                </Fab>
            </Container>
        </Box>
    )   
}