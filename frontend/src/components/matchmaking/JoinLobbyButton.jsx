import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button, TextField, Box, Collapse, Typography } from "@mui/material"
import joinLobby from "../../api-calls/matchmaking/joinLobby"

export default function JoinLobbyButton(props) {
    const router = useRouter()

    // Set state
    const [joinLobbyResponse, setJoinLobbyResponse] = useState(null)
    const [buttonPlaceholder, setButtonPlaceholder] = useState("Join lobby")
    const [showPasswordInput, setShowPasswordInput] = useState(false)
    const [password, setPassword] = useState("")
    console.log("The lobby ID is: ", props.id)

    async function handleJoinLobby(formData) {
        const response = await joinLobby(props.id, formData.get("password"))
        if (response) {
            setJoinLobbyResponse(response)
            setButtonPlaceholder("Successfully joined lobby")
            setTimeout(() => {
                props.isDetailedView
                ? window.location.reload()
                : router.push(`/matchmaking/${props.id}`)
            }, 1000)
        }
        else {
            setButtonPlaceholder("Failed to join lobby")
            // setTimeout(() => {
            //     window.location.reload()
            // }, 1000)
        }
    }

    const handleShowPasswordForm = () => {
        setShowPasswordInput(true)
    }

    return (
        <Box sx={{ width: '100%' }}>
            {!showPasswordInput ? (
                <Button 
                    fullWidth
                    variant="contained"
                    onClick={handleShowPasswordForm}
                    disabled={buttonPlaceholder !== "Join lobby"}
                    sx={{
                        bgcolor: '#FF6B35',
                        color: '#FFFFFF',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                        borderRadius: 2,
                        py: 1.5,
                        boxShadow: 'none',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: '#FF8A65',
                            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                            transform: 'translateY(-1px)'
                        },
                        '&:disabled': {
                            bgcolor: '#BDBDBD',
                            color: '#FFFFFF'
                        }
                    }}
                >
                    Join lobby
                </Button>
            ) : (
                <form action={handleJoinLobby}>
                    <Button 
                        fullWidth
                        variant="contained"
                        type="submit"
                        disabled={buttonPlaceholder !== "Join lobby"}
                        sx={{
                            bgcolor: buttonPlaceholder === "Successfully joined lobby" ? '#4CAF50' : 
                                    buttonPlaceholder === "Failed to join lobby" ? '#F44336' : '#FF6B35',
                            color: '#FFFFFF',
                            fontWeight: 600,
                            fontSize: '0.875rem',
                            textTransform: 'none',
                            borderRadius: 2,
                            py: 1.5,
                            boxShadow: 'none',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                bgcolor: buttonPlaceholder === "Successfully joined lobby" ? '#4CAF50' : 
                                        buttonPlaceholder === "Failed to join lobby" ? '#F44336' : '#FF8A65',
                                boxShadow: buttonPlaceholder === "Join lobby" 
                                    ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                                transform: buttonPlaceholder === "Join lobby" 
                                    ? 'translateY(-1px)' : 'none'
                            },
                            '&:disabled': {
                                bgcolor: buttonPlaceholder === "Successfully joined lobby" ? '#4CAF50' : 
                                        buttonPlaceholder === "Failed to join lobby" ? '#F44336' : '#BDBDBD',
                                color: '#FFFFFF'
                            }
                        }}
                    >
                        {buttonPlaceholder === "Join lobby" ? "Confirm Join" : buttonPlaceholder}
                    </Button>
                
                <Collapse in={showPasswordInput} timeout={300}>
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            name="password"
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            size="small"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    bgcolor: '#FAFAFA',
                                    borderRadius: 2,
                                    fontSize: '0.875rem',
                                    '& fieldset': {
                                        borderColor: '#E0E0E0',
                                        borderWidth: 1
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#FF6B35'
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#FF6B35',
                                        borderWidth: 2
                                    }
                                },
                                '& .MuiInputBase-input': {
                                    py: 1.5
                                }
                            }}
                        />
                        <Typography 
                            variant="caption" 
                            sx={{ 
                                color: '#9E9E9E', 
                                mt: 0.5, 
                                display: 'block',
                                fontSize: '0.75rem'
                            }}
                        >
                            Enter the match password to join
                        </Typography>
                    </Box>
                </Collapse>
                </form>
            )}
        </Box>
    )
}