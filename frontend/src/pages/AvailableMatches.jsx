import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/available-matches.css"
import { useState, useEffect } from "react"
import MatchItem from "../components/MatchItem.jsx"
import { Box, Paper, Typography } from "@mui/material"
import pullMatchesData from "../api-calls/pullMatchesData.js"

export default function AvailableMatches() {
    // Get the token from local storage
    const token = localStorage.getItem("authToken")

    // Set the state for available matches
    const [availableMatches, setAvailableMatches] = useState([])

    // Get the list of available matches from the backend
    useEffect(() => {
        const fetchMatches = async () => {
            setAvailableMatches(await pullMatchesData())
        }
        if (token) {
            fetchMatches()
        }
    }, [])

    // The map data returned is an array of match objects
    // Each match object will be mapped to a match component
    const matchList = availableMatches?.map(match => 
        <MatchItem 
            key={match.id}
            entry={match}
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