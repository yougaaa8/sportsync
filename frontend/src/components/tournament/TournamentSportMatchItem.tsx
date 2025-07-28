import { TournamentSportMatch } from "@/types/TournamentTypes";
import { Paper, Button, TextField, Typography, Box, Chip, Divider } from "@mui/material"
import { useState } from "react";
import editTournamentSportMatch from "../../api-calls/tournament/editTournamentSportMatch"

export default function TournamentSportMatchItem(props: {
    match: TournamentSportMatch,
    tournamentId: string
}) {
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)

    // Set functions
    function manageTournamentClick(formData: FormData) {
        editTournamentSportMatch(props.tournamentId, props.match.tournament_sport, props.match.id, formData)
    }

    console.log("match: ", props.match)
    
    return (
        <Paper 
            elevation={2}
            sx={{ 
                p: 4,
                borderRadius: 2,
                border: '1px solid #F0F0F0',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.12)'
                }
            }}
        >
            {/* Match Header */}
            <Box sx={{ mb: 3 }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        mb: 2,
                        fontSize: { xs: '1.25rem', md: '1.5rem' },
                        fontWeight: 700,
                        color: 'text.primary',
                        textAlign: 'center'
                    }}
                >
                    {props.match.team1} VS {props.match.team2}
                </Typography>
                
                {props.match.winner && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Chip 
                            label={`Winner: ${props.match.winner}`}
                            color="primary"
                            sx={{ 
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        />
                    </Box>
                )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Match Details */}
            <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
                mb: 3
            }}>
                {/* Left Column */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Date & Time
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.match.date || "Not scheduled"}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Venue
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.match.venue || "TBD"}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Round
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.match.round || "N/A"}
                        </Typography>
                    </Box>
                </Box>

                {/* Right Column */}
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Score
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600 }}>
                                {props.match.score_team1 || 0}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                -
                            </Typography>
                            <Typography variant="h5" color="text.primary" sx={{ fontWeight: 600 }}>
                                {props.match.score_team2 || 0}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                            Match Status
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            {props.match.winner ? "Completed" : "Pending"}
                        </Typography>
                    </Box>

                    {props.match.match_notes && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                                Notes
                            </Typography>
                            <Typography variant="body1" color="text.primary">
                                {props.match.match_notes}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* Action Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: isShowForm ? 3 : 0 }}>
                <Button 
                    variant="outlined"
                    color="secondary"
                    onClick={() => setIsShowForm(prev => !prev)}
                    sx={{ 
                        px: 3,
                        py: 1.5,
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}
                >
                    {isShowForm ? "Close Form" : "Edit Match Details"}
                </Button>
            </Box>

            {/* Edit Form */}
            {isShowForm && (
                <Paper 
                    elevation={1}
                    sx={{ 
                        p: 3,
                        backgroundColor: 'background.default',
                        borderRadius: 2
                    }}
                >
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3,
                            color: 'text.primary',
                            fontWeight: 600
                        }}
                    >
                        Edit Match Details
                    </Typography>
                    
                    <Box 
                        component="form" 
                        action={manageTournamentClick}
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                name="team1"
                                id="team1"
                                label="Team 1"
                                variant="outlined"
                                defaultValue={props.match.team1}
                                sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                            />
                            <TextField
                                name="team2"
                                id="team2"
                                label="Team 2"
                                variant="outlined"
                                defaultValue={props.match.team2}
                                sx={{ minWidth: { xs: '100%', sm: '300px' } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                name="round"
                                id="round"
                                label="Round"
                                variant="outlined"
                                defaultValue={props.match.round}
                                sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                            />
                            <TextField
                                name="date"
                                id="date"
                                label="Date"
                                variant="outlined"
                                type="datetime-local"
                                defaultValue={props.match.date}
                                InputLabelProps={{ shrink: true }}
                                sx={{ minWidth: { xs: '100%', sm: '250px' } }}
                            />
                            <TextField
                                name="venue"
                                id="venue"
                                label="Venue"
                                variant="outlined"
                                defaultValue={props.match.venue}
                                sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                name="score_team1"
                                id="score_team1"
                                label="Team 1 Score"
                                variant="outlined"
                                type="number"
                                defaultValue={props.match.score_team1}
                                sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                            />
                            <TextField
                                name="score_team2"
                                id="score_team2"
                                label="Team 2 Score"
                                variant="outlined"
                                type="number"
                                defaultValue={props.match.score_team2}
                                sx={{ minWidth: { xs: '100%', sm: '150px' } }}
                            />
                            <TextField
                                name="winner"
                                id="winner"
                                label="Winner"
                                variant="outlined"
                                defaultValue={props.match.winner}
                                sx={{ minWidth: { xs: '100%', sm: '200px' } }}
                            />
                        </Box>

                        <TextField
                            name="match_notes"
                            id="match_notes"
                            label="Match Notes"
                            variant="outlined"
                            multiline
                            rows={3}
                            defaultValue={props.match.match_notes}
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
                                Update Match Details
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}
        </Paper>
    )
}