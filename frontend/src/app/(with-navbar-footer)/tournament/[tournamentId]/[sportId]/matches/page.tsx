"use client"
import { useState, useEffect } from "react"
import { pullTournamentSportMatches } from "../../../../../../api-calls/tournament/pullTournamentSportMatches"
import TournamentSportMatchItem from "@/components/tournament/TournamentSportMatchItem"
import { Button, TextField, Paper, Typography, Box, Container } from "@mui/material"
import createNewSportMatch from "../../../../../../api-calls/tournament/createNewSportMatch"
import { TournamentSportMatch } from "../../../../../../types/TournamentTypes"

export default function SportMatches({ params }: {
    params: Promise<{
        tournamentId: string,
        sportId: string
    }>
}) {
    // Set states
    const [matches, setMatches] = useState<TournamentSportMatch[] | null>(null)
    const [resolvedParams, setResolvedParams] = useState<{ tournamentId: string, sportId: string } | null>(null)
    const [isShowForm, setIsShowForm] = useState(false)

    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            setResolvedParams(await params)
        }
        resolveParams()
    }, [params])

    // Get the matches from API
    useEffect(() => {
        if (!resolvedParams) return; // Guard clause to prevent undefined calls
        const fetchMatches = async () => {
            setMatches(await pullTournamentSportMatches(resolvedParams.tournamentId, resolvedParams.sportId))
        }
        fetchMatches()
    }, [resolvedParams])

    // Map the matches in the API to a matchItem
    const matchList = matches?.map(match => (
        resolvedParams?.tournamentId ? (
            <TournamentSportMatchItem key={match.id} match={match} tournamentId={resolvedParams.tournamentId} />
        ) : null
    ))

    // Define functions 
    async function createNewMatchClick(formData: FormData) {
        createNewSportMatch(resolvedParams?.tournamentId, resolvedParams?.sportId, formData)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography 
                    variant="h1" 
                    sx={{ 
                        mb: 3,
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        color: 'text.primary'
                    }}
                >
                    Sport Matches
                </Typography>
                
                <Button 
                    variant="contained" 
                    color="primary"
                    onClick={() => setIsShowForm(prev => !prev)}
                    sx={{ 
                        mb: 3,
                        px: 3,
                        py: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}
                >
                    {isShowForm ? "Close Form" : "Create New Match"}
                </Button>

                {isShowForm && (
                    <Paper 
                        elevation={2}
                        sx={{ 
                            p: 4, 
                            mb: 4,
                            borderRadius: 2,
                            border: '1px solid #F0F0F0'
                        }}
                    >
                        <Typography 
                            variant="h4" 
                            sx={{ 
                                mb: 3,
                                color: 'text.primary',
                                fontWeight: 600
                            }}
                        >
                            Create New Match
                        </Typography>
                        
                        <Box 
                            component="form" 
                            action={createNewMatchClick}
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 3
                            }}
                        >
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    name="team1"
                                    label="Team 1"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                                />
                                <TextField
                                    name="team2"
                                    label="Team 2"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    name="round"
                                    label="Round"
                                    variant="outlined"
                                    sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                                />
                                <TextField
                                    name="date"
                                    label="Date"
                                    variant="outlined"
                                    type="datetime-local"
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ minWidth: { xs: '100%', sm: '250px' } }}
                                />
                                <TextField
                                    name="venue"
                                    label="Venue"
                                    variant="outlined"
                                    sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    name="score_team1"
                                    label="Team 1 Score"
                                    variant="outlined"
                                    type="number"
                                    sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                                />
                                <TextField
                                    name="score_team2"
                                    label="Team 2 Score"
                                    variant="outlined"
                                    type="number"
                                    sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                                />
                                <TextField
                                    name="winner"
                                    label="Winner"
                                    variant="outlined"
                                    sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                                />
                            </Box>

                            <TextField
                                name="match_notes"
                                label="Match Notes"
                                variant="outlined"
                                multiline
                                rows={3}
                                fullWidth
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ 
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '0.875rem',
                                        fontWeight: 600
                                    }}
                                >
                                    Create New Sport Match
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {matchList}
            </Box>
        </Container>
    )
}