import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/available-matches.css"
import { useState, useEffect } from "react"
import MatchItem from "../components/MatchItem.jsx"
import { Box, Paper, Typography } from "@mui/material"

export default function AvailableMatches() {
    // Get the token from local storage
    const token = localStorage.getItem("authToken")

    // Set the state for available matches
    const [availableMatches, setAvailableMatches] = useState([])

    // Get the list of available matches from the backend
    useEffect(() => {
        const fetchMatches = async () => {
            try {
                console.log("Fetching available matches...")
                const response = await fetch("https://sportsync-backend-8gbr.onrender.com/api/matchmaking/lobbies", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    throw new Error("Failed to fetch matches")
                }

                const data = await response.json()
                console.log("Available matches data: ", data)
                setAvailableMatches(data)
            }
            catch (error) {
                console.error("Error fetching available matches:", error)
            }
        }

        if (token) {
            fetchMatches()
        }
    }, [])

    // The map data returned is an array of match objects
    // Each match object will be mapped to a match component
    const matchList = availableMatches.map(match => 
        <MatchItem 
            key={match.id}
            id={match.id}
            name={match.name}
            sport={match.sport}
            location={match.location}
            date={match.date}
            description={match.description}
            startTime={match.start_time}
            endTime={match.end_time}
            maxCapacity={match.max_capacity}
        />
    )

    return (
        <>
            <Navbar />
            <main>
                <h1 className="available-matches-header page-title">Matches Currently Open</h1>
                <button className="available-matches-create-button">
                    <a href="/matchmaking-form">Create a new match</a>
                </button>
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 3,
                    justifyItems: "center",
                    alignItems: "stretch",
                    width: "100%",
                    mt: 2
                }}>
                    {matchList}
                </Box>
            </main>
            <Footer />
        </>
    )
}