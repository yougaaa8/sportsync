import { Typography, Chip, Button, Box, TextField, MenuItem, Card, Fade, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TournamentSport } from "../../types/TournamentTypes"
import { useState } from "react"
import editTournamentSport from "../../api-calls/tournament/editTournamentSport"
import deleteTournamentSport from "../../api-calls/tournament/deleteTournamentSport"

export default function TournamentSportsItem(props: TournamentSport) {
    console.log("Tournament Sports Item Props: ", props)
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    
    // Set constant values
    const pathname = usePathname()
    const role = localStorage.getItem("role")

    // Define functions
    async function manageSportClick(formData: FormData) {
        await editTournamentSport(props.tournament.id, props.id, formData)
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    async function deleteSportClick() {
        await deleteTournamentSport(props.tournament.id, props.id)
        setTimeout(() => {
            window.location.reload()
        }, 500)
        setDeleteDialogOpen(false)
    }

    const getGenderColor = (gender: string) => {
        switch (gender.toLowerCase()) {
            case 'male':
                return {
                    bg: '#e3f2fd',
                    color: '#1976d2',
                    border: '#bbdefb'
                }
            case 'female':
                return {
                    bg: '#fce4ec',
                    color: '#c2185b',
                    border: '#f8bbd9'
                }
            case 'co-ed':
            case 'coed':
                return {
                    bg: '#f3e5f5',
                    color: '#7b1fa2',
                    border: '#e1bee7'
                }
            default:
                return {
                    bg: '#f5f5f5',
                    color: '#616161',
                    border: '#e0e0e0'
                }
        }
    }

    const genderColors = getGenderColor(props.gender)

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 3,
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease-in-out',
                background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)',
                    border: '1px solid #e0e0e0'
                }
            }}
        >
            {/* Main Content */}
            {!isShowForm && (
                <Link href={`${pathname}/${props.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 2 }}>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 700,
                                    background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    letterSpacing: 0.3
                                }}
                            >
                                {props.sport} Tournament
                            </Typography>
                            
                            <Chip
                                label={props.gender.charAt(0).toUpperCase() + props.gender.slice(1)}
                                sx={{
                                    backgroundColor: genderColors.bg,
                                    color: genderColors.color,
                                    border: `1px solid ${genderColors.border}`,
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    px: 1
                                }}
                                size="medium"
                            />
                            
                            {props.description && (
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.6,
                                        maxWidth: 400
                                    }}
                                >
                                    {props.description}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Link>
            )}

            {/* Action Buttons */}
            {role === "staff" && <Box sx={{ 
                px: 3, 
                pb: 3, 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                borderTop: !isShowForm ? '1px solid #f0f0f0' : 'none',
                pt: !isShowForm ? 2 : 0
            }}>
                <Button 
                    onClick={() => setIsShowForm(prev => !prev)}
                    variant={isShowForm ? "outlined" : "contained"}
                    size="medium"
                    sx={{
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        ...(isShowForm ? {
                            borderColor: '#FF6B35',
                            color: '#FF6B35',
                            '&:hover': {
                                borderColor: '#E65100',
                                backgroundColor: 'rgba(255, 107, 53, 0.04)'
                            }
                        } : {
                            background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                            boxShadow: '0 3px 10px rgba(255, 107, 53, 0.3)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.4)',
                            }
                        })
                    }}
                >
                    {isShowForm ? "Cancel" : "Manage Sport"}
                </Button>
                
                {!isShowForm && (
                    <Button 
                        onClick={() => setDeleteDialogOpen(true)}
                        variant="outlined"
                        size="medium"
                        color="error"
                        sx={{
                            px: 3,
                            py: 1,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#f44336',
                            color: '#f44336',
                            '&:hover': {
                                borderColor: '#d32f2f',
                                backgroundColor: 'rgba(244, 67, 54, 0.04)'
                            }
                        }}
                    >
                        Delete Sport
                    </Button>
                )}
            </Box>}

            {/* Edit Form */}
            <Fade in={isShowForm}>
                <Box>
                    {isShowForm && (
                        <Box sx={{ px: 3, pb: 3 }}>
                            <Box
                                component="form"
                                action={manageSportClick}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 3,
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: '#fafafa',
                                    border: '1px solid #f0f0f0'
                                }}
                            >
                                <Typography 
                                    variant="h6" 
                                    sx={{ 
                                        fontWeight: 700,
                                        color: '#FF6B35',
                                        textAlign: 'center',
                                        mb: 1
                                    }}
                                >
                                    Update Sport Details
                                </Typography>
                                
                                <TextField
                                    label="Sport Name"
                                    name="sport"
                                    defaultValue={props.sport}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#ffffff',
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
                                    defaultValue={props.gender}
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#ffffff',
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
                                    <MenuItem value="coed">Co-Ed</MenuItem>
                                </TextField>

                                <TextField
                                    label="Description"
                                    name="description"
                                    defaultValue={props.description}
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            backgroundColor: '#ffffff',
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
                                        mt: 1,
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
                                    Update Sport Details
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Fade>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, color: '#f44336' }}>
                    Delete Tournament Sport
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete &quot;{props.sport}&quot; tournament? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button 
                        onClick={() => setDeleteDialogOpen(false)}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={deleteSportClick} 
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}