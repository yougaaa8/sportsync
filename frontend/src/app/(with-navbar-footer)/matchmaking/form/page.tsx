"use client"

import { useRouter } from "next/navigation";
import createMatchLobby from "../../../../api-calls/matchmaking/createMatchLobby";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Stack
} from '@mui/material';

export default function OpenMatchmaking() {
    // Set states

    // Set static values
    const router = useRouter();

    // Set functions
    async function handleCreateLobby(formData: FormData) {
        const response = await createMatchLobby(formData)
        if (response) {
            router.push("/matchmaking");
        }
        else {
            console.log("Failed to create match")
        }
    }

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography 
                    variant="h2" 
                    sx={{ 
                        color: '#FF6B35',
                        fontWeight: 600,
                        mb: 1
                    }}
                >
                    Create a new matchmaking lobby
                </Typography>
            </Box>
            
            <Paper 
                elevation={0}
                sx={{ 
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #F0F0F0',
                    backgroundColor: '#FFFFFF'
                }}
            >
                <form action={handleCreateLobby}>
                    <Stack spacing={3}>
                        <TextField
                            name="name"
                            label="Lobby Name"
                            placeholder="Enter lobby name"
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
                            placeholder="Enter the sport you would like to play"
                            variant="outlined"
                            fullWidth
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="date"
                                label="Date"
                                type="date"
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

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                name="startTime"
                                label="Start Time"
                                type="time"
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
                            size="large"
                            fullWidth
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                                boxShadow: 'none',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #FF8A65 0%, #FF6B35 100%)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                },
                            }}
                        >
                            Create a new lobby
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Container>
    );
}