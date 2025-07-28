"use client"
import { useEffect, useState } from "react"
import pullTournamentSportsTeamMembers from "../../../../../../api-calls/tournament/pullTournamentSportsTeamMembers"
import TeamMemberItem from "../../../../../../components/tournament/TeamMemberItem"
import { Button, Paper, TextField, Typography, Box, Container } from "@mui/material"
import pullUserProfileFromEmail from "@/api-calls/profile/pullUserProfileFromEmail"
import addNewTeamMember from "../../../../../../api-calls/tournament/addNewTeamMember"

export default function TournamentSportTeamMembers({ params }: {
    params: Promise<{
        tournamentId: string,
        sportId: string,
        teamId: string
    }>
}) {
    // Set states
    const [members, setMembers] = useState([])
    const [resolvedParams, setResolvedParams] = useState<{
        tournamentId: string,
        sportId: string,
        teamId: string
    } | null>(null)
    const [isShowAddNewMemberForm, setIsShowAddNewMemberForm] = useState(false)

    // Resolve params
    useEffect(() => {
        const resolveParams = async () => {
            setResolvedParams(await params)
        }
        resolveParams()
    }, [params])

    // Pull the team members
    useEffect(() => {
        if (
            resolvedParams &&
            resolvedParams.tournamentId &&
            resolvedParams.sportId &&
            resolvedParams.teamId
        ) {
            const fetchMembers = async () => {
                setMembers(
                    await pullTournamentSportsTeamMembers(
                        resolvedParams.tournamentId,
                        resolvedParams.sportId,
                        resolvedParams.teamId
                    )
                )
            }
            fetchMembers()
        }
    }, [resolvedParams])

    console.log("resolvedParams: ", resolvedParams)
    // Map the team members 
    const membersList = members?.map((member, index) => (
        <TeamMemberItem key={index} member={member} 
            tournament={resolvedParams?.tournamentId ? Number(resolvedParams.tournamentId) : 0}
            tournamentSport={resolvedParams?.sportId ? Number(resolvedParams.sportId) : 0}
            tournamentSportTeam={resolvedParams?.teamId ? Number(resolvedParams.teamId) : 0}/>
    ))

    // Define functions
    async function addNewMemberClick(formData: FormData) {
        const userProfile = await pullUserProfileFromEmail(formData.get("email"))
        const user = userProfile.user_id
        formData.append("user", user)
        formData.delete("email")
        console.log("user: ", formData.get("user"))
        addNewTeamMember(resolvedParams?.tournamentId, resolvedParams?.sportId, resolvedParams?.teamId, formData)
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <Box className="mb-8">
                <Typography 
                    variant="h4" 
                    component="h1" 
                    className="mb-6 font-semibold text-gray-800"
                >
                    Team Members
                </Typography>
                
                <Button 
                    variant={isShowAddNewMemberForm ? "outlined" : "contained"}
                    color="primary"
                    onClick={() => setIsShowAddNewMemberForm(prev => !prev)}
                    className="mb-6"
                    sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {isShowAddNewMemberForm ? "Close Form" : "Add New Team Member"}
                </Button>

                {isShowAddNewMemberForm && (
                    <Paper 
                        elevation={2} 
                        className="p-6 mb-8 bg-white"
                        sx={{ 
                            borderRadius: 3,
                            border: '1px solid #F0F0F0'
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            className="mb-4 font-semibold text-gray-700"
                        >
                            Add New Team Member
                        </Typography>
                        
                        <Box component="form" action={addNewMemberClick}>
                            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <TextField
                                    name="jersey_name"
                                    label="Jersey Name"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                
                                <TextField
                                    name="jersey_number"
                                    label="Jersey Number"
                                    variant="outlined"
                                    type="number"
                                    fullWidth
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                
                                <TextField
                                    name="role"
                                    label="Role"
                                    variant="outlined"
                                    fullWidth
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                                
                                <TextField
                                    name="email"
                                    label="Member Email"
                                    variant="outlined"
                                    type="email"
                                    fullWidth
                                    required
                                    sx={{ 
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />
                            </Box>
                            
                            <Box className="mb-6">
                                <Typography 
                                    variant="body2" 
                                    className="mb-2 font-medium text-gray-600"
                                >
                                    Photo
                                </Typography>
                                <input
                                    name="photo"
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                                />
                            </Box>
                            
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Add New Member
                            </Button>
                        </Box>
                    </Paper>
                )}
            </Box>

            <Box className="space-y-4">
                {membersList}
            </Box>
        </Container>
    )
}