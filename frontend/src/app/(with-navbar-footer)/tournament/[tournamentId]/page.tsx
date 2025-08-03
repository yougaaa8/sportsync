"use client"

import { useState, useEffect } from "react";
import TournamentSportsItem from "../../../../components/tournament/TournamentSportsItem"
import { pullTournamentData } from "../../../../api-calls/tournament/pullTournamentData.js"
import { pullTournamentSportsData } from "../../../../api-calls/tournament/pullTournamentSportsData.js";
import { TournamentSport, Tournament } from "../../../../types/TournamentTypes"
import { Button, Box, TextField, Typography, MenuItem, Container, Fade, Card } from "@mui/material"
import createTournamentSport from "../../../../api-calls/tournament/createTournamentSport"
import sendTournamentAnnouncement from "../../../../api-calls/tournament/sendTournamentAnnouncement";

export default function TournamentSportsPage({params}: {
    params: Promise<{
        tournamentId: string
    }>
}) {

    // Set states
    const [tournamentSports, setTournamentSports] = useState<TournamentSport[] | null>(null);
    const [tournamentData, setTournamentData] = useState<Tournament[] | null>(null);
    const [tournamentIdState, setTournamentIdState] = useState<number | null>(null)
    const [isShowForm, setIsShowForm] = useState(false)
    const [token, setToken] = useState<string | null>(null);

    // Set static values
    const role = localStorage.getItem("role")

    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            const { tournamentId } = await params
            console.log("This is the tournament id: ", tournamentId)
            setTournamentIdState(parseInt(tournamentId))
        }
        resolveParams()
    }, [params])

    useEffect(() => {
        if (typeof window !== "undefined") {
            setToken(localStorage.getItem("authToken"));
        }
    }, []);

    // Fetch the tournament sports list
    useEffect(() => {
        const fetchTournamentSports = async () => {
            setTournamentSports(await pullTournamentSportsData(tournamentIdState))
        };
        if (token && tournamentIdState) {
            fetchTournamentSports();
        }
    }, [tournamentIdState, token]);  

    // Fetch tournament data for the tournament name
    useEffect(() => {
        async function fetchData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchData();
    }, []);

    // Map the tournament sports list to JSX elements
    const tournamentSportsElements = tournamentSports ? tournamentSports.map((sport, idx) => (
        <TournamentSportsItem
            key={sport.id || idx}
            id={sport.id}
            sport={sport.sport}
            gender={sport.gender}
            description={sport.description}
            tournament={sport.tournament}
        />
    )) : null;

    // Resolve the name of the tournament from the extracted tournament data
    const name = tournamentData?.find(tournament => tournament.id === tournamentIdState)?.name

    // Find the tournament object for this sportId
    const tournament = tournamentData?.find(tournament => tournament.id === tournamentIdState)

    // Define functions
    function createTournamentSportClick(formData: FormData) {
        console.log("tournament: ", tournament)
        if (tournamentIdState !== null) {
            formData.append("tournament", tournamentIdState.toString())
        }
        createTournamentSport(tournamentIdState, formData)
        // setTimeout(() => {
        //     window.location.reload()
        // }, 1000)
    }

    function handleAnnouncement(formData: FormData) {
        sendTournamentAnnouncement(formData, tournamentIdState)
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header Section */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                {tournamentData && tournamentIdState && (
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            mb: 2,
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}
                    >
                        {name}
                    </Typography>
                )}
                
                {role === "staff" && <Button 
                    onClick={() => setIsShowForm(prev => !prev)}
                    variant="contained"
                    size="large"
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                        }
                    }}
                >
                    {isShowForm ? "Cancel" : "Add Tournament Sport"}
                </Button>}
            </Box>

            {/* Announcement Form Section */}
            {role === "staff" && (
                <Card
                    elevation={0}
                    sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        mb: 4,
                        p: 4,
                        borderRadius: 3,
                        border: '1px solid #f0f0f0',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
                    }}
                >
                    <Box
                        component="form"
                        action={handleAnnouncement}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 1,
                                fontWeight: 700,
                                color: '#FF6B35',
                                textAlign: 'center'
                            }}
                        >
                            Send Announcement
                        </Typography>

                        <TextField
                            label="Title"
                            name="title"
                            variant="outlined"
                            fullWidth
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                    '&:hover': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                    }
                                }
                            }}
                        />

                        <TextField
                            label="Message"
                            name="message"
                            variant="outlined"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                    '&:hover': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: '#ffffff',
                                    }
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                                py: 1.5,
                                mt: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '1rem',
                                background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                                }
                            }}
                        >
                            Send Announcement
                        </Button>
                    </Box>
                </Card>
            )}

            {/* Form Section */}
            <Fade in={isShowForm}>
                <Box sx={{ mb: 4 }}>
                    {isShowForm && (
                        <Card
                            elevation={0}
                            sx={{
                                maxWidth: 500,
                                mx: 'auto',
                                p: 4,
                                borderRadius: 3,
                                border: '1px solid #f0f0f0',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
                                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)'
                            }}
                        >
                            <Box
                                component="form"
                                action={createTournamentSportClick}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                }}
                            >
                                <Typography 
                                    variant="h5" 
                                    sx={{ 
                                        mb: 1,
                                        fontWeight: 700,
                                        color: '#FF6B35',
                                        textAlign: 'center'
                                    }}
                                >
                                    Add Tournament Sport
                                </Typography>

                                <TextField
                                    label="Sport Name"
                                    name="sport"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#ffffff',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#ffffff',
                                            }
                                        }
                                    }}
                                />

                                <TextField
                                    select
                                    label="Gender Category"
                                    name="gender"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue="male"
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#ffffff',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#ffffff',
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                    <MenuItem value="co-ed">Co-Ed</MenuItem>
                                </TextField>

                                <TextField
                                    label="Description (Optional)"
                                    name="description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                backgroundColor: '#ffffff',
                                            },
                                            '&.Mui-focused': {
                                                backgroundColor: '#ffffff',
                                            }
                                        }
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    sx={{
                                        py: 1.5,
                                        mt: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                                        boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                                            boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                                        }
                                    }}
                                >
                                    Create Sport
                                </Button>
                            </Box>
                        </Card>
                    )}
                </Box>
            </Fade>

            {/* Sports List Section */}
            <Box>
                {tournamentSports ? (
                    tournamentSports.length > 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {tournamentSportsElements}
                        </Box>
                    ) : (
                        <Card 
                            sx={{ 
                                p: 6, 
                                textAlign: 'center',
                                borderRadius: 3,
                                border: '1px solid #f0f0f0',
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Typography variant="h6" color="text.secondary">
                                No sports added yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Start by adding your first tournament sport above
                            </Typography>
                        </Card>
                    )
                ) : (
                    <Card 
                        sx={{ 
                            p: 6, 
                            textAlign: 'center',
                            borderRadius: 3,
                            border: '1px solid #f0f0f0'
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            Loading tournament sports...
                        </Typography>
                    </Card>
                )}
            </Box>
        </Container>
    )
}