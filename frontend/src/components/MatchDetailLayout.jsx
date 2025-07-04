import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { Paper, Box, Typography, Divider } from "@mui/material"
import JoinLobbyButton from "../components/JoinLobbyButton.jsx"
import LeaveLobbyButton from "../components/LeaveLobbyButton.jsx"
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material"
import RemoveLobbyMemberButton from "./RemoveLobbyMemberButton.jsx"

export default function MatchDetailLayout() {
    // Get the token from local storage
    const token = localStorage.getItem("authToken")

    // Retrieve the lobby ID from the URL parameters
    const { lobbyId } = useParams()

    // Set state to store match details 
    const [matchDetails, setMatchDetails] = useState(null)
    const [matchMembers, setMatchMembers] = useState(null)
    
    // Use the lobbyId to fetch match details
    useEffect(() => {
        const fetchMatchDetails = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${lobbyId}/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Match details not found")
                }

                const data = await response.json()
                setMatchDetails(data)   
                console.log("Match details retrieved: ", data)
            } catch (error) {
                console.error("Error fetching match details: ", error)
            }
        }
        if (lobbyId) {
            fetchMatchDetails()
        }
    }, [lobbyId])

    // Use the lobbyId to fetch match members
    useEffect(() => {
        const fetchMatchMembers = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies/${lobbyId}/members/`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Match members not found")
                }

                const data = await response.json()
                setMatchMembers(data)
                console.log("Match members retrieved: ", data)
            } catch (error) {
                console.error("Error fetching match members: ", error)
            }
        }
        if (lobbyId) {
            fetchMatchMembers()
        }
    }, [lobbyId])

    // Convert the match members into an array of table rows
    const matchMembersList = matchMembers && matchMembers.map((member, index) => (
        <TableRow>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{member.first_name + " " + member.last_name}</TableCell>
            <TableCell>{member.date_joined}</TableCell>
            <TableCell>{member.status}</TableCell>
            <TableCell>{member.notes}</TableCell>
            <TableCell><RemoveLobbyMemberButton userId={member.id} lobbyId={member.lobby}></RemoveLobbyMemberButton></TableCell>
        </TableRow>)
    )

    return (
        <>
            {(matchDetails && matchMembers ) && (
                <>
                    <Navbar />
                    <h1 className="page-title">{matchDetails.name}</h1>
                    <Paper
                        elevation={6}
                        sx={{
                            m: { xs: 1, md: 4 },
                            p: { xs: 2, md: 6 },
                            width: { xs: "99vw", md: "96vw" },
                            maxWidth: "1200px",
                            minHeight: "70vh",
                            bgcolor: "#fff7e6",
                            borderRadius: 5,
                            boxShadow: "0 8px 32px 0 rgba(245, 158, 11, 0.15)",
                            border: "2px solid #ffe5b4",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            mx: "auto",
                        }}
                    >
                        <Box sx={{ width: "100%", maxWidth: 600, mx: "auto", textAlign: "center" }}>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="subtitle1" sx={{ color: "#888", mb: 1 }}>
                                Sport: <b>{matchDetails.sport}</b>
                            </Typography>
                            <Typography sx={{ color: "#444", fontSize: 16, mb: 0.5 }}>
                                <b>Date:</b> {matchDetails.date}
                            </Typography>
                            <Typography sx={{ color: "#444", fontSize: 16, mb: 0.5 }}>
                                <b>Location:</b> {matchDetails.location}
                            </Typography>
                            <Typography sx={{ color: "#444", fontSize: 16, mb: 0.5 }}>
                                <b>Start:</b> {matchDetails.startTime}
                            </Typography>
                            <Typography sx={{ color: "#444", fontSize: 16, mb: 0.5 }}>
                                <b>End:</b> {matchDetails.endTime}
                            </Typography>
                            <Typography sx={{ color: "#444", fontSize: 16, mb: 2 }}>
                                <b>Capacity:</b> 5/{matchDetails.maxCapacity}
                            </Typography>
                            <Paper
                                sx={{
                                    my: 2,
                                    p: 2,
                                    bgcolor: "#fffdfa",
                                    borderRadius: 2,
                                    border: "1px solid #ffe5b4",
                                    boxShadow: "none",
                                    fontSize: 16,
                                    color: "#555",
                                    textAlign: "left"
                                }}
                                elevation={0}
                            >
                                <Typography sx={{ fontSize: 16 }}>{matchDetails.description}</Typography>
                            </Paper>
                        </Box>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No.</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Date Joined</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            {matchMembersList ? 
                            <TableBody>
                                {matchMembersList}
                            </TableBody> : null}
                        </Table>
                        <Box sx={{ px: 2, pb: 2, mt: 2 }}>
                            <JoinLobbyButton id={lobbyId} />
                            <LeaveLobbyButton id={lobbyId} />
                        </Box>
                    </Paper>
                    <Footer />
                </>
            )}
        </>
    )
}