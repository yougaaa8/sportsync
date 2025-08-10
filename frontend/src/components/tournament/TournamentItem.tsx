import { 
    Typography, 
    Box, 
    Chip, 
    Divider, 
    Button, 
    TextField, 
    MenuItem,
    Card,
    CardContent,
    Stack,
    Fade
} from "@mui/material";
import Link from "next/link";
import { Tournament } from "../../types/TournamentTypes"
import { useState } from "react"
import editTournament from "../../api-calls/tournament/editTournament"
import deleteTournament from "../../api-calls/tournament/deleteTournament"

export default function TournamentItem(props: {
    entry: Tournament
}) {
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)

    // Set static values
    const role = localStorage.getItem("role")

    // Define functions
    async function manageTournamentClick(formData: FormData) {
        await editTournament(props.entry.id, formData)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    async function deleteTournamentClick() {
        await deleteTournament(props.entry.id)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    console.log("These are the props for the tournament item: ", props);
    console.log("This is the tournament start date: ", props.entry.start_date)

    // Status color mapping
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'upcoming':
                return { 
                    bgcolor: '#fff7ed', 
                    color: '#ea580c',
                    borderColor: '#fed7aa'
                };
            case 'ongoing':
                return { 
                    bgcolor: '#f0fdf4', 
                    color: '#16a34a',
                    borderColor: '#bbf7d0'
                };
            case 'completed':
                return { 
                    bgcolor: '#f8fafc', 
                    color: '#64748b',
                    borderColor: '#e2e8f0'
                };
            default:
                return { 
                    bgcolor: '#f8fafc', 
                    color: '#64748b',
                    borderColor: '#e2e8f0'
                };
        }
    };

    const statusStyle = getStatusColor(props.entry.status);

    return (
        <Box sx={{ mb: 3 }}>
            {/* Tournament Card */}
            {!isShowForm && (
                <Link href={`/tournament/${props.entry.id}`} style={{ textDecoration: 'none' }}>
                    <Card
                        elevation={0}
                        sx={{
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            background: 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
                                borderColor: '#ff6b35'
                            }
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                {/* Logo with subtle styling */}
                                {props.entry.logo_url && (
                                    <Box sx={{ mb: 3 }}>
                                        <img 
                                            src={props.entry.logo_url} 
                                            alt="tournament logo"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'contain',
                                                borderRadius: '8px',
                                                display: 'block',
                                                margin: '0 auto'
                                            }}
                                        />
                                    </Box>
                                )}

                                {/* Tournament Name */}
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: 700,
                                        color: '#1f2937',
                                        mb: 2,
                                        letterSpacing: '-0.025em'
                                    }}
                                >
                                    {props.entry.name}
                                </Typography>

                                {/* Status Chip */}
                                <Chip
                                    label={props.entry.status.charAt(0).toUpperCase() + props.entry.status.slice(1)}
                                    size="small"
                                    sx={{
                                        ...statusStyle,
                                        border: `1px solid ${statusStyle.borderColor}`,
                                        fontWeight: 600,
                                        fontSize: '0.75rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        mb: 3
                                    }}
                                />

                                <Divider sx={{ mb: 3, borderColor: '#f1f5f9' }} />

                                {/* Date Information */}
                                <Stack 
                                    direction={{ xs: 'column', sm: 'row' }} 
                                    spacing={3} 
                                    justifyContent="center"
                                    sx={{ mb: 3 }}
                                >
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#6b7280',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}
                                        >
                                            Start Date
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#1f2937',
                                                fontWeight: 600,
                                                mt: 0.5
                                            }}
                                        >
                                            {props.entry.start_date}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#6b7280',
                                                fontWeight: 600,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em'
                                            }}
                                        >
                                            End Date
                                        </Typography>
                                        <Typography 
                                            variant="body2" 
                                            sx={{ 
                                                color: '#1f2937',
                                                fontWeight: 600,
                                                mt: 0.5
                                            }}
                                        >
                                            {props.entry.end_date}
                                        </Typography>
                                    </Box>
                                </Stack>

                                {/* Description */}
                                <Typography 
                                    variant="body2" 
                                    sx={{ 
                                        color: '#6b7280',
                                        lineHeight: 1.6,
                                        fontStyle: props.entry.description ? 'normal' : 'italic'
                                    }}
                                >
                                    {props.entry.description || 'No description provided'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Link>
            )}

            {/* Action Buttons */}
            {role === "staff" && <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mt: 2 }}
                justifyContent="center"
            >
                <Button 
                    onClick={() => setIsShowForm(prev => !prev)}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: '#d1d5db',
                        color: '#6b7280',
                        py: 1,
                        px: 3,
                        '&:hover': {
                            borderColor: '#ff6b35',
                            backgroundColor: 'rgba(255, 107, 53, 0.04)',
                            color: '#ff6b35'
                        }
                    }}
                >
                    {isShowForm ? "Cancel Edit" : "Manage Tournament"}
                </Button>

                <Button 
                    onClick={deleteTournamentClick}
                    variant="outlined"
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: '#fecaca',
                        color: '#dc2626',
                        py: 1,
                        px: 3,
                        '&:hover': {
                            borderColor: '#dc2626',
                            backgroundColor: 'rgba(220, 38, 38, 0.04)'
                        }
                    }}
                >
                    Delete Tournament
                </Button>
            </Stack>}

            {/* Edit Form */}
            {isShowForm && (
                <Fade in={true} timeout={300}>
                    <Card 
                        elevation={0}
                        sx={{ 
                            mt: 3,
                            border: '1px solid #e5e7eb',
                            borderRadius: 4,
                            maxWidth: 500,
                            mx: 'auto'
                        }}
                    >
                        <CardContent sx={{ p: 4 }}>
                            <Box
                                component="form"
                                action={manageTournamentClick}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 3,
                                }}
                            >
                                <Box sx={{ textAlign: 'center', mb: 2 }}>
                                    <Typography 
                                        variant="h6" 
                                        sx={{ 
                                            fontWeight: 700,
                                            color: 'primary.main',
                                            mb: 1
                                        }}
                                    >
                                        Update Tournament Details
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ color: 'text.secondary' }}
                                    >
                                        Make changes to the tournament information
                                    </Typography>
                                </Box>

                                <Divider />

                                <TextField
                                    label="Tournament Name"
                                    name="name"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={props.entry.name}
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
                                    select
                                    label="Status"
                                    name="status"
                                    variant="outlined"
                                    fullWidth
                                    defaultValue={props.entry.status}
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
                                >
                                    <MenuItem value="upcoming">Upcoming</MenuItem>
                                    <MenuItem value="ongoing">Ongoing</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                </TextField>

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        label="Start Date"
                                        name="start_date"
                                        type="date"
                                        variant="outlined"
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                        defaultValue={props.entry.start_date}
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
                                        defaultValue={props.entry.end_date}
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

                                <TextField
                                    label="Description"
                                    name="description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    defaultValue={props.entry.description}
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

                                <Box>
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            mb: 1,
                                            fontWeight: 600,
                                            color: '#374151'
                                        }}
                                    >
                                        Tournament Logo
                                    </Typography>
                                    <Box
                                        sx={{
                                            border: '2px dashed #d1d5db',
                                            borderRadius: 2,
                                            p: 3,
                                            backgroundColor: '#fafafa',
                                            '&:hover': {
                                                borderColor: '#9ca3af',
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            name="logo"
                                            accept="image/*"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                fontSize: '14px',
                                                color: '#6b7280'
                                            }}
                                        />
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#9ca3af',
                                                display: 'block',
                                                mt: 1
                                            }}
                                        >
                                            Choose an image file for the tournament logo
                                        </Typography>
                                    </Box>
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
                                    Update Tournament
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            )}
        </Box>
    );
}