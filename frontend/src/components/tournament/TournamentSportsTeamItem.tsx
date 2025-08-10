import { TournamentSportTeam } from "@/types/TournamentTypes";
import { Paper, Button, TextField, Typography, Box, Avatar, Chip } from "@mui/material" 
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useState } from "react"
import editTournamentSportTeam from "../../api-calls/tournament/editTournamentSportTeam"
import deleteTournamentSportTeam from "../../api-calls/tournament/deleteTournamentSportTeam"

export default function TournamentSportsTeamItem(props: {
    team: TournamentSportTeam
    tournament: number
}) {
    console.log("Tournament Sports Team Item Props: ", props)
    // Set states
    const [isShowForm, setIsShowForm] = useState(false)

    // Set static values
    const pathname = usePathname()
    const role = localStorage.getItem("role")
    const isStaff = role === "staff"

    // Define functions 
    async function manageTeamDetailsClick(formData: FormData) {
        await editTournamentSportTeam(props.tournament, props.team.tournament_sport.id, props.team.id, formData)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }

    async function deleteTeamClick() {
        await deleteTournamentSportTeam(props.tournament, props.team.tournament_sport.id, props.team.id)
        setTimeout(() => {
            window.location.reload()
        }, 1000)
    }
    
    return (
        <Box className="mb-6">
            <Paper 
                elevation={1} 
                className="overflow-hidden transition-all duration-300 hover:shadow-lg"
                sx={{ borderRadius: 3 }}
            >
                <Link href={`${pathname}/${props.team.id}`} className="block">
                    <Box className="p-6 hover:bg-gray-50 transition-colors duration-200">
                        <Box className="flex items-center space-x-4">
                            {props.team.logo_url ? (
                                <Avatar
                                    src={props.team.logo_url}
                                    alt={props.team.name + " logo"}
                                    sx={{ width: 56, height: 56 }}
                                    className="border-2 border-gray-100"
                                />
                            ) : (
                                <Avatar
                                    sx={{ 
                                        width: 56, 
                                        height: 56,
                                        bgcolor: 'primary.main',
                                        fontSize: '1.5rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {props.team.name.charAt(0).toUpperCase()}
                                </Avatar>
                            )}
                            
                            <Box className="flex-1">
                                <Typography 
                                    variant="h5" 
                                    className="font-semibold mb-2"
                                    color="text.primary"
                                >
                                    {props.team.name}
                                </Typography>
                                
                                {props.team.description && (
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                        className="line-clamp-2"
                                    >
                                        {props.team.description}
                                    </Typography>
                                )}
                            </Box>
                            
                            <Chip 
                                label="View Details" 
                                color="primary" 
                                variant="outlined"
                                size="small"
                            />
                        </Box>
                    </Box>
                </Link>
                
                {isStaff && <Box className="px-6 pb-4 border-t border-gray-100">
                    <Box className="flex items-center space-x-3 pt-4">
                        <Button 
                            variant="outlined" 
                            color="primary"
                            size="small"
                            onClick={() => setIsShowForm(prev => !prev)}
                            className="text-sm"
                        >
                            {isShowForm ? "Cancel" : "Manage Team Details"}
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            color="error"
                            size="small"
                            onClick={deleteTeamClick}
                            className="text-sm"
                        >
                            Delete Team
                        </Button>
                    </Box>
                </Box>}
            </Paper>

            {isShowForm && (
                <Paper 
                    elevation={2} 
                    className="mt-4 p-6"
                    sx={{ borderRadius: 3 }}
                >
                    <Typography variant="h6" className="mb-4" color="primary">
                        Edit Team Details
                    </Typography>
                    
                    <Box component="form" action={manageTeamDetailsClick} className="space-y-4">
                        <TextField
                            name="name"
                            label="Team Name"
                            variant="outlined"
                            fullWidth
                            defaultValue={props.team.name}
                            size="medium"
                        />

                        <Box className="space-y-2">
                            <Typography variant="body2" color="text.secondary" className="font-medium">
                                Update Team Logo
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
                            defaultValue={props.team.description}
                        />

                        <Box className="flex justify-end pt-2">
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="primary"
                                className="px-6"
                            >
                                Update Team Details
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}
        </Box>
    );
}