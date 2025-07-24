"use client"

import { useState, useEffect } from "react"
import { Paper, Box, Typography, Chip } from "@mui/material"
import JoinLobbyButton from "../../../../components/matchmaking/JoinLobbyButton.jsx"
import LeaveLobbyButton from "../../../../components/matchmaking/LeaveLobbyButton.jsx"
import { Table, TableHead, TableRow, TableCell, TableBody, TableContainer } from "@mui/material"
import RemoveLobbyMemberButton from "../../../../components/matchmaking/RemoveLobbyMemberButton.jsx"
import UpdateLobbyDetailsButton from "../../../../components/matchmaking/UpdateLobbyDetailsButton.jsx"
import DeleteLobbyButton from "../../../../components/matchmaking/DeleteLobbyButton.jsx"
import pullMatchMembers from "../../../../api-calls/matchmaking/pullMatchMembers"
import pullMatchDetails from "../../../../api-calls/matchmaking/pullMatchDetails"
import { Match, MatchMember } from "../../../../types/MatchmakingTypes"

export default function MatchDetailLayout({params}: {
    params: Promise<{
        matchId: string
    }>
}) {
     // Set state to store match details 
    const [matchDetails, setMatchDetails] = useState<Match | null>(null)
    const [matchMembers, setMatchMembers] = useState<MatchMember[]>([])
    const [matchId, setMatchId] = useState<number | null>(null)
    
    // Retrieve the lobby ID from the URL parameters
    useEffect(() => {
        const getMatchId = async () => {
            const resolvedParams = await params
            console.log("resolved params: ", resolvedParams)
            setMatchId(parseInt(resolvedParams.matchId))
        }
        getMatchId()
    }, [params])

    console.log("The lobby id is: ", matchId)
    
    // Use the matchId to fetch match details
    useEffect(() => {
        const fetchMatchDetails = async () => {
            setMatchDetails(await pullMatchDetails(matchId))
        }
        if (matchId) {
            fetchMatchDetails()
        }
    }, [matchId])

    // Use the matchId to fetch match members
    useEffect(() => {
        const fetchMatchMembers = async () => {
            setMatchMembers(await pullMatchMembers(matchId))
        }
        if (matchId) {
            fetchMatchMembers()
        }
    }, [matchId])

    // Convert the match members into an array of table rows
    const matchMembersList = matchMembers && matchMembers.map((member, index) => (
        <TableRow 
            key={index}
            sx={{
                '&:nth-of-type(odd)': {
                    backgroundColor: '#fafafa',
                },
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                },
            }}
        >
            <TableCell sx={{ fontWeight: 500, color: '#666' }}>{index + 1}</TableCell>
            <TableCell sx={{ fontWeight: 600, color: '#212121' }}>
                {member.first_name + " " + member.last_name}
            </TableCell>
            <TableCell sx={{ color: '#666' }}>{member.date_joined}</TableCell>
            <TableCell>
                <Chip 
                    label={member.status} 
                    size="small"
                    sx={{
                        backgroundColor: member.status === 'player' ? '#e8f5e8' : '#fff3e0',
                        color: member.status === 'player' ? '#2e7d32' : '#f57c00',
                        fontWeight: 500,
                        fontSize: '0.75rem'
                    }}
                />
            </TableCell>
            <TableCell sx={{ color: '#666', fontStyle: member.notes ? 'normal' : 'italic' }}>
                {member.notes || 'No notes'}
            </TableCell>
            <TableCell>
                <RemoveLobbyMemberButton userId={member.user} lobbyId={member.lobby} />
            </TableCell>
        </TableRow>)
    )

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: 4 }}>
            {(matchDetails && matchMembers) && (
                <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 4 } }}>
                    {/* Header Section */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography 
                            variant="h3" 
                            sx={{ 
                                fontWeight: 700, 
                                color: '#212121', 
                                mb: 1,
                                fontSize: { xs: '2rem', md: '2.5rem' }
                            }}
                        >
                            {matchDetails.name}
                        </Typography>
                        <Chip 
                            label={matchDetails.sport}
                            sx={{
                                backgroundColor: '#FF6B35',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                px: 2,
                                py: 0.5
                            }}
                        />
                    </Box>

                    {/* Match Details Card */}
                    <Paper
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            p: 4,
                            mb: 4,
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white'
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600, 
                                color: '#212121', 
                                mb: 3,
                                borderBottom: '2px solid #FF6B35',
                                pb: 1,
                                display: 'inline-block'
                            }}
                        >
                            Match Details
                        </Typography>

                        {/* Match Info Grid */}
                        <Box sx={{ 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            gap: 3,
                            mb: 3
                        }}>
                            <Box sx={{ minWidth: 200 }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                                    Date
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                                    {matchDetails.date}
                                </Typography>
                            </Box>

                            <Box sx={{ minWidth: 200 }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                                    Location
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                                    {matchDetails.location}
                                </Typography>
                            </Box>

                            <Box sx={{ minWidth: 150 }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                                    Start Time
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                                    {matchDetails.start_time}
                                </Typography>
                            </Box>

                            <Box sx={{ minWidth: 150 }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                                    End Time
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                                    {matchDetails.end_time}
                                </Typography>
                            </Box>

                            <Box sx={{ minWidth: 150 }}>
                                <Typography variant="body2" sx={{ color: '#666', mb: 0.5, fontWeight: 500 }}>
                                    Capacity
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600, color: '#212121' }}>
                                    {matchMembers.length} / {matchDetails.max_capacity}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Description */}
                        <Box>
                            <Typography variant="body2" sx={{ color: '#666', mb: 1, fontWeight: 500 }}>
                                Description
                            </Typography>
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: '#f9f9f9',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    boxShadow: 'none'
                                }}
                            >
                                <Typography sx={{ color: '#555', lineHeight: 1.6 }}>
                                    {matchDetails.description}
                                </Typography>
                            </Paper>
                        </Box>

                        {/* Update Button */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <UpdateLobbyDetailsButton matchDetails={matchDetails} lobbyId={matchId} />
                        </Box>
                    </Paper>

                    {/* Participants Section */}
                    <Paper
                        elevation={2}
                        sx={{
                            borderRadius: 3,
                            p: 4,
                            mb: 4,
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white'
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600, 
                                color: '#212121', 
                                mb: 3,
                                borderBottom: '2px solid #FF6B35',
                                pb: 1,
                                display: 'inline-block'
                            }}
                        >
                            Participants ({matchMembers.length})
                        </Typography>

                        <TableContainer>
                            <Table sx={{ '& .MuiTableCell-head': { backgroundColor: '#f5f5f5' } }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>No.</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Name</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Date Joined</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Notes</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: '#212121' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                {matchMembersList ? 
                                <TableBody>
                                    {matchMembersList}
                                </TableBody> : null}
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* Action Buttons */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        mb: 3
                    }}>
                        <JoinLobbyButton id={matchId} isDetailedView={true} />
                        <LeaveLobbyButton id={matchId} />
                    </Box>

                    {/* Delete Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <DeleteLobbyButton lobbyId={matchId} />
                    </Box>
                </Box>
            )}
        </Box>
    )
}