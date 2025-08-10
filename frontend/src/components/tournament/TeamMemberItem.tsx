import { TournamentSportTeamMember } from "@/types/TournamentTypes"
import { Paper, Button, TextField, Typography, Box, Avatar, Chip } from "@mui/material"
import { useState } from "react"
import editTournamentSportTeamMember from "../../api-calls/tournament/editTournamentSportTeamMember"
import pullUserProfileFromEmail from "@/api-calls/profile/pullUserProfileFromEmail"

export default function TeamMemberItem(props: {
    member: TournamentSportTeamMember
    tournament: number,
    tournamentSport: number,
    tournamentSportTeam: number
}) {
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)

    // Set static values
    const role = localStorage.getItem("role")
    const isStaff = role === "staff"

    // Set functions
    async function manageTeamMemberClick(formData: FormData) {
        const userProfile = await pullUserProfileFromEmail(formData.get("email"))
        console.log("userProfile: ", userProfile)
        const user = userProfile.user_id
        formData.append("user", user)
        formData.delete("email")
        await editTournamentSportTeamMember(props.tournament, props.tournamentSport, props.tournamentSportTeam, props.member.id, formData)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    return (
        <Paper 
            elevation={1}
            className="transition-all duration-300 hover:shadow-lg"
            sx={{ 
                borderRadius: 3,
                border: '1px solid #F0F0F0',
                overflow: 'hidden'
            }}
        >
            {/* Member Card */}
            <Box className="p-6">
                <Box className="flex items-start justify-between mb-4">
                    <Box className="flex items-center space-x-4">
                        {props.member.photo_url ? (
                            <Avatar
                                src={props.member.photo_url}
                                alt={props.member.jersey_name + " photo"}
                                sx={{ 
                                    width: 64, 
                                    height: 64,
                                    border: '3px solid #FF6B35'
                                }}
                            />
                        ) : (
                            <Avatar
                                sx={{ 
                                    width: 64, 
                                    height: 64,
                                    bgcolor: '#FF6B35',
                                    fontSize: '1.5rem',
                                    fontWeight: 600
                                }}
                            >
                                {props.member.jersey_name?.charAt(0) || 'M'}
                            </Avatar>
                        )}
                        
                        <Box>
                            <Typography 
                                variant="h5" 
                                component="h2"
                                className="font-semibold text-gray-800 mb-1"
                            >
                                {props.member.jersey_name}
                            </Typography>
                            
                            <Box className="flex items-center space-x-3">
                                <Chip 
                                    label={`#${props.member.jersey_number}`}
                                    color="primary"
                                    size="small"
                                    sx={{
                                        fontWeight: 600,
                                        borderRadius: 2
                                    }}
                                />
                                
                                <Typography 
                                    variant="body2" 
                                    className="text-gray-600 font-medium"
                                >
                                    Role: {props.member.role}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    
                    {isStaff && <Button 
                        variant={isShowForm ? "contained" : "outlined"}
                        color="secondary"
                        onClick={() => setIsShowForm(prev => !prev)}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: 1
                        }}
                    >
                        {isShowForm ? "Cancel" : "Manage"}
                    </Button>}
                </Box>
            </Box>

            {/* Edit Form */}
            {isShowForm && (
                <Box 
                    className="border-t border-gray-200 bg-gray-50 p-6"
                    sx={{ backgroundColor: '#FAFAFA' }}
                >
                    <Typography 
                        variant="h6" 
                        className="mb-4 font-semibold text-gray-700"
                    >
                        Edit Member Details
                    </Typography>
                    
                    <Box component="form" action={manageTeamMemberClick}>
                        <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                type="email"
                                fullWidth
                                size="small"
                                required
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                            
                            <TextField
                                name="jersey_name"
                                label="Jersey Name"
                                variant="outlined"
                                fullWidth
                                size="small"
                                defaultValue={props.member.jersey_name}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                            
                            <TextField
                                name="jersey_number"
                                label="Jersey Number"
                                variant="outlined"
                                type="number"
                                fullWidth
                                size="small"
                                defaultValue={props.member.jersey_number}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                            
                            <TextField
                                name="role"
                                label="Role"
                                variant="outlined"
                                fullWidth
                                size="small"
                                defaultValue={props.member.role}
                                sx={{ 
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        backgroundColor: 'white'
                                    }
                                }}
                            />
                        </Box>
                        
                        <Box className="mb-6">
                            <Typography 
                                variant="body2" 
                                className="mb-2 font-medium text-gray-600"
                            >
                                Update Photo
                            </Typography>
                            <input
                                name="photo"
                                type="file"
                                accept="image/*"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            />
                        </Box>
                        
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Update Member Details
                        </Button>
                    </Box>
                </Box>
            )}
        </Paper>
    )
}