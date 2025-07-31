"use client"

import { useRouter } from 'next/navigation'
import createEvent from "../../../../api-calls/events/createEvent";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Container
} from '@mui/material';
import BackButton from '@/components/BackButton';

export default function EventForm() {
    const router = useRouter()

    const handleCreateEvent = async (formData: FormData) => {
        const result = await createEvent(formData)
        if (result.success) {
            router.push('/events') // Use router.push instead of navigate
        }
    }   

    return (
        <><BackButton /><Container maxWidth="md" className="py-8">
            <Box className="mb-8">
                <Typography
                    variant="h3"
                    component="h1"
                    className="text-center font-bold text-gray-800 mb-2"
                >
                    Create a new event
                </Typography>
            </Box>

            <Paper
                elevation={2}
                className="p-8 max-w-2xl mx-auto"
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
            >
                <form action={handleCreateEvent}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <TextField
                            name="name"
                            label="Event Name"
                            type="text"
                            placeholder="BizAd Charity Run 2025"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }} />

                        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                            <TextField
                                name="date"
                                label="Event Date"
                                type="date"
                                fullWidth
                                variant="outlined"
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }} />

                            <TextField
                                name="registrationDeadline"
                                label="Registration Deadline"
                                type="date"
                                fullWidth
                                variant="outlined"
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }} />
                        </Box>

                        <TextField
                            name="location"
                            label="Location"
                            type="text"
                            placeholder="NUS Sports Hall"
                            fullWidth
                            variant="outlined"
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }} />

                        <TextField
                            name="description"
                            label="Event Description"
                            type="text"
                            placeholder="Charity run with fun prizes!"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            required
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }} />

                        <TextField
                            name="registrationFee"
                            label="Registration Fee (SGD)"
                            type="number"
                            placeholder="20.00"
                            fullWidth
                            variant="outlined"
                            required
                            inputProps={{
                                step: "0.01",
                                min: "0"
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }} />

                        <Box sx={{ pt: 2 }}>
                            <Button
                                href="/events"
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 20px rgba(255, 107, 53, 0.4)',
                                        transform: 'translateY(-2px)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                Create Event
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Paper>
        </Container></>
    )
}