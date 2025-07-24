import { Paper, Typography, Box, Chip } from "@mui/material";
import JoinLobbyButton from "./JoinLobbyButton";
import Link from "next/link";
import LeaveLobbyButton from "./LeaveLobbyButton";

export default function MatchItem(props) {
    return (
        <Paper
            elevation={0}
            sx={{
                width: 320, // Fixed width instead of maxWidth
                minHeight: 400,
                bgcolor: "#FFFFFF",
                borderRadius: 3,
                border: "1px solid #E0E0E0",
                display: "flex",
                flexDirection: "column",
                transition: "all 0.2s ease-in-out",
                cursor: "pointer",
                overflow: "hidden",
                mx: 'auto', // Center the card horizontally
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: "1px solid #FF6B35"
                }
            }}
        >
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
                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
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
                                    mr: 1
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
                        <JoinLobbyButton id={props.entry.id} isDetailedView={false}/>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <LeaveLobbyButton id={props.entry.id} />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
}