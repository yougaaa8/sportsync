"use client"

import { pullTournamentData } from "../../../api-calls/tournament/pullTournamentData"
import { useEffect, useState } from "react";
import { 
    Typography, 
    Container, 
    Box, 
    Skeleton,
    Fade,
    Paper,
    Stack,
    Button,
    TextField,
    MenuItem,
    Card,
    CardContent,
    Divider
} from "@mui/material";
import TournamentItem from "../../../components/tournament/TournamentItem";
import { Tournament } from "../../../types/TournamentTypes"
import createTournament from "../../../api-calls/tournament/createTournament"

export default function TournamentPage() {
    // Set states
    const [tournamentData, setTournamentData] = useState<Tournament[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isShowForm, setIsShowForm] = useState(false)
    const [role, setRole] = useState<string | null>(null);

    // Pull tournaments data
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await pullTournamentData();
                setTournamentData(data);
            } catch (error) {
                console.error('Error fetching tournament data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        setRole(localStorage.getItem("role"));
    }, []);

    // Define functions
    function createTournamentClick(formData: FormData) {
        createTournament(formData)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    // Define components
    const tournamentList = tournamentData ? tournamentData.map((tournament, index) => (
        <Fade in={true} timeout={300 + (index * 100)} key={index}>
            <div>
                <TournamentItem 
                    entry={tournament}
                />
            </div>
        </Fade>
    )) : null;

    const renderSkeletons = () => (
        Array.from(new Array(3)).map((_, index) => (
            <Paper className="p-6" key={index}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="30%" height={24} className="mt-2" />
                <Skeleton variant="text" width="100%" height={20} className="mt-4" />
            </Paper>
        ))
    );
    
    return (
        <Box className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <Box className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-16">
                <Container maxWidth="lg">
                    <Fade in={true} timeout={500}>
                        <Box className="text-center">
                            <Typography 
                                variant="h1" 
                                component="h1"
                                className="font-bold mb-4 text-white"
                                sx={{
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            >
                                NUS Tournaments
                            </Typography>
                            <Typography 
                                variant="h5" 
                                component="p"
                                className="text-orange-100 font-light"
                                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                            >
                                Compete, Connect, and Celebrate Excellence
                            </Typography>
                        </Box>
                    </Fade>
                </Container>
            </Box>

            {/* Main Content */}
            <Container maxWidth="lg" className="py-12">
                <Box className="mb-8">
                    <Typography 
                        variant="h4" 
                        component="h2"
                        className="text-gray-800 font-semibold mb-2"
                    >
                        Upcoming Tournaments
                    </Typography>
                    <Typography 
                        variant="body1" 
                        className="text-gray-600 mb-6"
                    >
                        Join the excitement and showcase your sporting prowess
                    </Typography>
                </Box>

                {/* Create Tournament Button */}
                {role === "staff" && (
                    <Box className="mb-8 flex justify-center">
                        <Button 
                            onClick={() => setIsShowForm(prev => !prev)}
                            variant="contained"
                            size="large"
                            sx={{
                                py: 1.5,
                                px: 4,
                                borderRadius: 3,
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            {isShowForm ? "Cancel" : "Create New Tournament"}
                        </Button>
                    </Box>
                )}

                {/* Create Tournament Form */}
                {isShowForm && role === "staff" && (
                    <Fade in={true} timeout={300}>
                        <Card 
                            elevation={0}
                            sx={{ 
                                mb: 6, 
                                maxWidth: 600, 
                                mx: 'auto',
                                border: '1px solid #e5e7eb',
                                borderRadius: 4,
                                overflow: 'visible'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Box
                                    component="form"
                                    action={createTournamentClick}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <Box className="text-center mb-2">
                                        <Typography 
                                            variant="h5" 
                                            sx={{ 
                                                fontWeight: 700,
                                                color: 'primary.main',
                                                mb: 1
                                            }}
                                        >
                                            Create New Tournament
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            Fill in the details below to create your tournament
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 1 }} />

                                    <TextField
                                        label="Tournament Name"
                                        name="name"
                                        variant="outlined"
                                        fullWidth
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                                backgroundColor: '#fafafa',
                                                '&:hover': {
                                                    backgroundColor: '#f5f5f5'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#ffffff'
                                                }
                                            }
                                        }}
                                    />

                                    <TextField
                                        label="Description"
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
                                                    backgroundColor: '#f5f5f5'
                                                },
                                                '&.Mui-focused': {
                                                    backgroundColor: '#ffffff'
                                                }
                                            }
                                        }}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2 }}>
                                        <TextField
                                            label="Start Date"
                                            name="start_date"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#fafafa',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff'
                                                    }
                                                }
                                            }}
                                        />

                                        <TextField
                                            label="End Date"
                                            name="end_date"
                                            type="date"
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{ shrink: true }}
                                            required
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#fafafa',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff'
                                                    }
                                                }
                                            }}
                                        />
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            sx={{ 
                                                flex: 1,
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                borderColor: '#d1d5db',
                                                color: '#6b7280',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                    backgroundColor: 'rgba(255, 107, 53, 0.04)'
                                                }
                                            }}
                                        >
                                            Upload Logo
                                            <input type="file" name="logo" hidden />
                                        </Button>

                                        <TextField
                                            select
                                            label="Status"
                                            name="status"
                                            variant="outlined"
                                            sx={{ 
                                                flex: 1,
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2,
                                                    backgroundColor: '#fafafa',
                                                    '&:hover': {
                                                        backgroundColor: '#f5f5f5'
                                                    },
                                                    '&.Mui-focused': {
                                                        backgroundColor: '#ffffff'
                                                    }
                                                }
                                            }}
                                            defaultValue="ongoing"
                                            required
                                        >
                                            <MenuItem value="ongoing">Ongoing</MenuItem>
                                            <MenuItem value="upcoming">Upcoming</MenuItem>
                                            <MenuItem value="completed">Completed</MenuItem>
                                        </TextField>
                                    </Box>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        sx={{ 
                                            mt: 2, 
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontSize: '1rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                            '&:hover': {
                                                boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                                                transform: 'translateY(-1px)'
                                            }
                                        }}
                                    >
                                        Create Tournament
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                )}

                <Stack spacing={3}>
                    {loading 
                        ? renderSkeletons()
                        : tournamentData && tournamentData.length > 0 
                        ? tournamentList
                        : (
                            <Paper className="p-12 text-center">
                                <Typography 
                                    variant="h6" 
                                    className="text-gray-500 mb-2"
                                >
                                    No Tournaments Available
                                </Typography>
                                <Typography 
                                    variant="body2" 
                                    className="text-gray-400"
                                >
                                    Check back soon for upcoming tournaments!
                                </Typography>
                            </Paper>
                        )
                    }
                </Stack>

                {/* Stats Section */}
                {tournamentData && tournamentData.length > 0 && (
                    <Fade in={true} timeout={800}>
                        <Box className="mt-16">
                            <Stack 
                                direction={{ xs: 'column', sm: 'row' }} 
                                spacing={4}
                                justifyContent="center"
                            >
                                <Paper className="p-6 text-center hover:shadow-lg transition-all duration-300 flex-1">
                                    <Typography 
                                        variant="h3" 
                                        className="text-orange-500 font-bold mb-2"
                                    >
                                        {tournamentData.length}
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        className="text-gray-600"
                                    >
                                        Active Tournaments
                                    </Typography>
                                </Paper>
                                <Paper className="p-6 text-center hover:shadow-lg transition-all duration-300 flex-1">
                                    <Typography 
                                        variant="h3" 
                                        className="text-indigo-600 font-bold mb-2"
                                    >
                                        12+
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        className="text-gray-600"
                                    >
                                        Sports Categories
                                    </Typography>
                                </Paper>
                                <Paper className="p-6 text-center hover:shadow-lg transition-all duration-300 flex-1">
                                    <Typography 
                                        variant="h3" 
                                        className="text-green-600 font-bold mb-2"
                                    >
                                        500+
                                    </Typography>
                                    <Typography 
                                        variant="body1" 
                                        className="text-gray-600"
                                    >
                                        Participants
                                    </Typography>
                                </Paper>
                            </Stack>
                        </Box>
                    </Fade>
                )}
            </Container>
        </Box>
    );
}