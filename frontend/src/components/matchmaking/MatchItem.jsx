import { Paper, Typography, Box, Chip } from "@mui/material";
import JoinLobbyButton from "./JoinLobbyButton";
import Link from "next/link";
import LeaveLobbyButton from "./LeaveLobbyButton";
import ViewLobbyButton from "./ViewLobbyButton.jsx"
import pullMatchMembers from "@/api-calls/matchmaking/pullMatchMembers";
import { useState, useEffect } from "react"

export default function MatchItem(props) {
    // Set states
    const [userId, setUserId] = useState(0)
    const [matchMembers, setMatchMembers] = useState([])

    // Get the user id from local storage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const retrievedUserId = localStorage.getItem("userId")
            if (retrievedUserId) {
                setUserId(retrievedUserId)
            }
        }
    })

    // Use the match ID to get a list of the match members
    const matchId = props.entry.id
    useEffect(() => {
        const fetchMatchMembers = async () => {
            setMatchMembers(await pullMatchMembers(matchId))
        }
        fetchMatchMembers()
    }, [])

    // Find the current logged in user's ID in the list of match members
    const isMemberOfLobby = matchMembers?.find(member => {
        console.log("This is the member id: ", member.user)
        return (member.user === parseInt(userId))
    })
    ? true
    : false

    console.log("These are the match members: ", matchMembers)
    console.log("The user is a member of this lobby: ", isMemberOfLobby)
    console.log("The user id is: ", userId)
    console.log("The type of user id is: ", typeof(userId))

    // If user is part of the match members, then it will say "View Lobby"
        // which will redirect the user to the lobby details page
    // Otherwise, it will say "Join lobby", which will also redirect the users to the lobby details page

    return (
        <Paper
            elevation={0}
            sx={{
                width: 320, // Fixed width instead of maxWidth
                minHeight: 400,
                bgcolor: "#FFFFFF",
                borderRadius: 3,
                border: "1px solid #E0E0E0",
                bgcolor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                overflow: "hidden",
                mx: 'auto', // Center the card horizontally
                position: 'relative',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: "1px solid #FF6B35"
                }
            }}
        >
            {/* Member status tag */}
            {isMemberOfLobby && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#E8F5E8',
                        color: '#2E7D32',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        letterSpacing: 0.3,
                        textTransform: 'uppercase',
                        border: '1px solid #C8E6C9',
                        zIndex: 2
                    }}
                >
                    Joined
                </Box>
            )}

            {/* Clickable content area */}
            <Link 
                href={`/matchmaking/${props.entry.id}`} 
                style={{ 
                    textDecoration: "none", 
                    color: "inherit", 
                    flex: 1,
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', pt: isMemberOfLobby ? 4.5 : 3 }}>
                    {/* Header with title and sport chip */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    color: "#212121", 
                                    fontSize: 18, 
                                    fontWeight: 600,
                                    lineHeight: 1.3,
                                    flex: 1,
                                    mr: 1,
                                    pr: 0 // Remove extra padding
                                }}
                            >
                                {props.entry.name}
                            </Typography>
                            <Chip 
                                label={props.entry.sport}
                                size="small"
                                sx={{
                                    backgroundColor: '#FF6B35',
                                    color: '#FFFFFF',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    height: 22,
                                    borderRadius: 1.5
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Match details in organized sections */}
                    <Box sx={{ mb: 3, flex: 1 }}>
                        {/* Date and time */}
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ 
                                color: "#9E9E9E", 
                                fontSize: 12, 
                                fontWeight: 500, 
                                mb: 0.5, 
                                textTransform: 'uppercase',
                                letterSpacing: 0.5 
                            }}>
                                Date & Time
                            </Typography>
                            <Typography sx={{ color: "#212121", fontSize: 14, fontWeight: 500, mb: 0.25 }}>
                                {props.entry.date}
                            </Typography>
                            <Typography sx={{ color: "#757575", fontSize: 13 }}>
                                {props.entry.start_time} - {props.entry.end_time}
                            </Typography>
                        </Box>

                        {/* Location and capacity in same row */}
                        <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ 
                                    color: "#9E9E9E", 
                                    fontSize: 12, 
                                    fontWeight: 500, 
                                    mb: 0.5, 
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5 
                                }}>
                                    Location
                                </Typography>
                                <Typography sx={{ color: "#212121", fontSize: 13, fontWeight: 500 }}>
                                    {props.entry.location}
                                </Typography>
                            </Box>
                            <Box sx={{ minWidth: 80 }}>
                                <Typography sx={{ 
                                    color: "#9E9E9E", 
                                    fontSize: 12, 
                                    fontWeight: 500, 
                                    mb: 0.5, 
                                    textTransform: 'uppercase',
                                    letterSpacing: 0.5 
                                }}>
                                    Capacity
                                </Typography>
                                <Typography sx={{ color: "#212121", fontSize: 13, fontWeight: 500 }}>
                                    {props.entry.max_capacity}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Description */}
                        <Box sx={{ mt: 'auto' }}>
                            <Typography sx={{ 
                                color: "#9E9E9E", 
                                fontSize: 12, 
                                fontWeight: 500, 
                                mb: 0.5, 
                                textTransform: 'uppercase',
                                letterSpacing: 0.5 
                            }}>
                                Description
                            </Typography>
                            <Typography sx={{ 
                                fontSize: 13, 
                                color: "#616161", 
                                lineHeight: 1.4,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                {props.entry.description}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Link>
            
            {/* Action buttons */}
            <Box sx={{ px: 3, pb: 3, borderTop: '1px solid #F5F5F5', pt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                        {!isMemberOfLobby && <JoinLobbyButton id={props.entry.id} isDetailedView={false} isMemberOfLobby={isMemberOfLobby}/>}
                        {isMemberOfLobby && <ViewLobbyButton id={props.entry.id} isDetailedView={false} isMemberOfLobby={isMemberOfLobby}/>}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <LeaveLobbyButton id={props.entry.id} />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}