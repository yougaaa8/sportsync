"use client"

import { useEffect, useState } from "react"
import pullTournamentSportsTeams from "../../../../../api-calls/tournament/pullTournamentSportsTeams"
import TournamentSportsTeamItem from "@/components/tournament/TournamentSportsTeamItem"
import { TournamentSportTeam } from "@/types/TournamentTypes"
import { Button, Paper, TextField, Typography, Box, Container } from "@mui/material"
import addNewTeam from "../../../../../api-calls/tournament/addNewTeam"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function TournamentSportTeams({ params }: {
    params: Promise<{
        tournamentId: string,
        sportId: string
    }>
}) {
    // Set states
    const [teams, setTeams] = useState<TournamentSportTeam[]>([])
    const [resolvedParams, setResolvedParams] = useState<{ tournamentId: string, sportId: string } | null>(null)
    const [isShowCreateTeamForm, setIsShowCreateTeamForm] = useState(false)

    // Set static values
    const pathname = usePathname()
    const role = localStorage.getItem("role")
    const isStaff = role === "staff"
    
    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            setResolvedParams(await params)
        }
        resolveParams()
    }, [params])

    console.log("Resolved params: ", resolvedParams)

    // Pull the teams information
    useEffect(() => {
        const fetchTeams = async () => {
            if (resolvedParams) {
                setTeams(await pullTournamentSportsTeams(resolvedParams?.tournamentId, resolvedParams?.sportId))
            }
        }
        fetchTeams()
    }, [resolvedParams])
  
    // Map into component
    const teamList = teams?.map((team, index) => {
        console.log("Mapping now")
        return (
            <TournamentSportsTeamItem 
                key={index} 
                team={team} 
                tournament={resolvedParams?.tournamentId ? Number(resolvedParams.tournamentId) : 0}
            />
        )
    })

    // Define functions
    async function createNewTeamClick(formData: FormData) {
        await addNewTeam(resolvedParams?.tournamentId, resolvedParams?.sportId, formData)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    return (
        <Container maxWidth="lg" className="py-8">
            <Box className="mb-8">
                <Typography 
                    variant="h2" 
                    component="h1" 
                    className="mb-6 text-center"
                    sx={{ 
                        background: 'linear-gradient(135deg, #FF6B35 0%, #E65100 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700
                    }}
                >
                    Sports Teams
                </Typography>
                
                {isStaff && <Box className="flex justify-center mb-6">
                    <Button 
                        variant="contained"
                        color="primary"
                        onClick={() => setIsShowCreateTeamForm(prev => !prev)}
                        size="large"
                        className="px-8 py-3"
                    >
                        {isShowCreateTeamForm ? "Close Form": "Add New Team"}
                    </Button>
                </Box>}

                {isShowCreateTeamForm && (
                    <Paper 
                        elevation={2} 
                        className="p-8 mb-8 max-w-2xl mx-auto"
                        sx={{ borderRadius: 3 }}
                    >
                        <Typography variant="h5" className="mb-6 text-center" color="primary">
                            Create New Team
                        </Typography>
                        
                        <Box component="form" action={createNewTeamClick} className="space-y-6">
                            <TextField
                                name="name"
                                label="Team Name"
                                variant="outlined"
                                fullWidth
                                required
                                className="mb-4"
                            />

                            <Box className="space-y-2">
                                <Typography variant="body2" color="text.secondary" className="font-medium">
                                    Team Logo
                                </Typography>
                                <Box
                                    component="input"
                                    type="file"
                                    name="logo"
                                    accept="image/*"
                                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                />
                            </Box>

                            <TextField
                                name="description"
                                label="Team Description"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                className="mb-6"
                            />

                            <Box className="flex justify-center pt-4">
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    size="large"
                                    className="px-8 py-3"
                                >
                                    Add New Team
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                )}
            </Box>

            <Button>
                <Link href={`${pathname}/matches`}>View Matches</Link>
            </Button>

            <Box className="space-y-4">
                {teamList}
            </Box>
        </Container>
    )
}