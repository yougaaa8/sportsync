"use client"

import { useState, useEffect } from "react"
import MatchItem from "../../../components/matchmaking/MatchItem.jsx"
import { Box, Typography, Button, Container } from "@mui/material"
import pullMatchesData from "../../../api-calls/matchmaking/pullMatchesData.js"
import { Match } from "../../../types/MatchmakingTypes.js"
import Link from "next/link.js"

export default function AvailableMatches() {
    // Set the state for available matches
    const [availableMatches, setAvailableMatches] = useState<Match[]>([])
    const [token, setToken] = useState("")

    // Get the token from local storage
    useEffect(() => {
      if (typeof window) {
        const authToken = localStorage.getItem("authToken")
        if (authToken) {
          setToken(authToken)
        }
      }
    }, [])

    // Get the list of available matches from the backend
    useEffect(() => {
        const fetchMatches = async () => {
            setAvailableMatches(await pullMatchesData())
        }
        if (token) {
            fetchMatches()
        }
    }, [token])

    // The map data returned is an array of match objects
    // Each match object will be mapped to a match component
    const matchList = availableMatches?.map(match => 
        <MatchItem 
            key={match.id}
            entry={match}
        />
    )

    return (
        <Box 
            component="main" 
            sx={{ 
                backgroundColor: '#FAFAFA',
                minHeight: '100vh',
                py: { xs: 3, md: 5 }
            }}
        >
            <Container maxWidth="lg">
                {/* Header section */}
                <Box sx={{ mb: 5, textAlign: 'center' }}>
                    <Typography 
                        variant="h1" 
                        sx={{ 
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                            fontWeight: 600,
                            color: '#212121',
                            mb: 1.5,
                            lineHeight: 1.2
                        }}
                    >
                        Matches Currently Open
                    </Typography>
                    
                    <Typography
                        sx={{
                            color: '#757575',
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            mb: 3,
                            maxWidth: 500,
                            mx: 'auto'
                        }}
                    >
                        Join existing matches or create your own sporting event
                    </Typography>
                    
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        component={Link}
                        href="/matchmaking/form"
                        sx={{
                            px: 4,
                            py: 1.5,
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: 'none',
                            background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                            '&:hover': {
                                boxShadow: '0 4px 16px rgba(255, 107, 53, 0.3)',
                                transform: 'translateY(-1px)',
                                background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)'
                            }
                        }}
                    >
                        Create a new match
                    </Button>
                </Box>

                {/* Matches grid */}
                <Box>
                    {availableMatches.length === 0 ? (
                        <Box sx={{ 
                            textAlign: 'center', 
                            py: 8,
                            px: 2
                        }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: '#757575', 
                                    mb: 1,
                                    fontSize: '1.1rem',
                                    fontWeight: 500
                                }}
                            >
                                No matches available
                            </Typography>
                            <Typography sx={{ color: '#9E9E9E', fontSize: '0.9rem' }}>
                                Be the first to create a match!
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: { xs: 2, sm: 2.5, md: 3 },
                            justifyContent: { xs: "center", sm: "flex-start" },
                            alignItems: "stretch",
                        }}>
                            {matchList}
                        </Box>
                    )}
                </Box>
            </Container>
        </Box>
    )
}