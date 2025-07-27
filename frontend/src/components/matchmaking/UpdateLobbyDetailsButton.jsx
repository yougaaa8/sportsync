import { 
    Button,
    TextField,
    Stack,
    Paper,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material"
import { useState } from "react"
import updateLobbyDetails from "../../api-calls/matchmaking/updateLobbyDetails"

export default function UpdateLobbyDetailsButton(props) {
    const [showForm, setShowForm] = useState(false)
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Update Lobby Details")

    async function updateLobby(formData) {
        console.log("Update lobby function is running with props: ", props)
        const response = await updateLobbyDetails(formData, props.lobbyId)
        if (response) {
            setButtonPlaceholder("Successfully updated lobby details");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
        else {
            setButtonPlaceholder("Failed to update lobby details");
            setTimeout(() => {
                setButtonPlaceholder("Update Lobby Details");
            }, 1500);
        }
    }

    function updateForm() {
        return (
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4,
                    mt: 3,
                    borderRadius: 3,
                    border: '1px solid #F0F0F0',
                    backgroundColor: '#FFFFFF'
                }}
            >
                <form action={updateLobby}>
                    <Stack spacing={3}>
                        <TextField
                            name="name"
                            label="Lobby Name"
                            defaultValue={props.matchDetails.name}
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            name="description"
                            label="Description"
                            defaultValue={props.matchDetails.description}
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            name="sport"
                            label="Sport"
                            defaultValue={props.matchDetails.sport}
                            placeholder="Enter the sport you would like to play"
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            name="date"
                            label="Date"
                            type="date"
                            defaultValue={props.matchDetails.date}
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="startTime"
                                label="Start Time"
                                type="time"
                                defaultValue={props.matchDetails.start_time}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />

                            <TextField
                                name="endTime"
                                label="End Time"
                                type="time"
                                defaultValue={props.matchDetails.end_time}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>

                        <TextField
                            name="location"
                            label="Location"
                            defaultValue={props.matchDetails.location}
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Open Lobby</InputLabel>
                            <Select
                                name="openLobby"
                                label="Open Lobby"
                                defaultValue=""
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                <MenuItem value="" disabled>
                                    Is this lobby open to anyone?
                                </MenuItem>
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            defaultValue={props.matchDetails.password}
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <TextField
                            name="maxCapacity"
                            label="Max Capacity"
                            placeholder="Enter the number of additional people you need for the game"
                            defaultValue={props.matchDetails.max_capacity}
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="warning"
                            size="large"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                                boxShadow: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FFB74D 0%, #FF9800 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)',
                                },
                            }}
                        >
                            {buttonPlaceholder}
                        </Button>

                        <Button
                            onClick={() => setShowForm(false)}
                            variant="outlined"
                            color="warning"
                            size="large"
                            fullWidth
                            sx={{
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                borderWidth: 2,
                                textTransform: 'none',
                                '&:hover': {
                                    backgroundColor: '#fff3e0',
                                    borderWidth: 2,
                                },
                            }}
                        >
                            Cancel
                        </Button>
                    </Stack>
                </form>
            </Paper>
        )
    }

    return (
        <>
            {!showForm && (
                <Button
                    onClick={() => setShowForm(prev => !prev)}
                    variant="outlined"
                    color="warning"
                    size="large"
                    sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        borderWidth: 2,
                        px: 3,
                        py: 1.5,
                        fontSize: '1rem',
                        textTransform: 'none',
                        letterSpacing: 0.5,
                        boxShadow: 'none',
                        '&:hover': {
                            backgroundColor: '#fff3e0',
                            borderColor: '#ff9800',
                            borderWidth: 2,
                            boxShadow: 'none',
                        },
                    }}
                >
                    Update Lobby Details
                </Button>
            )}
            {showForm && updateForm()}
        </>
    )
}