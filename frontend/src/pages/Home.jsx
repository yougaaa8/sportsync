import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import "../stylesheets/home.css"
import { useLocation } from "react-router-dom"
import { Paper, Typography } from "@mui/material";
import { useState, useEffect } from "react"
import { pullTournamentData } from "../api-calls/pullTournamentData.js"
import { pullEventsData } from "../api-calls/pullEventsData.js"
import pullMatchesData from "../api-calls/pullMatchesData.js"
import TournamentItem from "../components/TournamentItem.jsx"
import EventItem from "../components/EventItem.jsx";    
import MatchItem from "../components/MatchItem.jsx";

export default function Home() {
    const newUser = localStorage.getItem("email") || "User";
    const [tournamentData, setTournamentData] = useState(null);
    const [eventsData, setEventsData] = useState(null);
    const [matchesData, setMatchesData] = useState(null);

    // Retrieve tournament data
    useEffect(() => {
        async function fetchTournamentData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchTournamentData();
    }, [])

    // Retrieve event data
    useEffect(() => {
        async function fetchEventsData() {
            const data = await pullEventsData();
            setEventsData(data);
        }
        fetchEventsData();
    }, [])

    // Retrieve matches data
    useEffect(() => {
        async function fetchMatchesData() {
            const data = await pullMatchesData();
            setMatchesData(data);
            console.log("Matches data: ", data);
        }
        fetchMatchesData();
    }, [])

    // Turn the tournament data into a list
    const tournamentList = tournamentData && tournamentData.map(tournament => (
        <TournamentItem entry={tournament} key={tournament.id} />
    ));

    // Turn the event data into a list
    const eventsList = eventsData && eventsData.map(event => (
        <EventItem event={event}></EventItem>
    ))

    // Turn the matches data into a list
    const matchesList = matchesData && matchesData.map(match => (
        <MatchItem entry={match}></MatchItem>
    ))

    return (
        <>
            <main>
                <Navbar />
                <h1 className="page-title">SportSync</h1>
                <Typography variant="h3">Logged in as {localStorage.getItem("fullName")}</Typography>
                <br />
                <Paper>
                    <Typography variant="h1">Live Tournaments</Typography>
                    {tournamentList}
                </Paper>
                <Paper sx={{ mt: 4, p: 3, bgcolor: "#fff" }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#f59e0b", mb: 2, textAlign: "center" }}>
                        Open Matches
                    </Typography>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3, 1fr)",
                            gap: "32px",
                            minHeight: "400px",
                            padding: "16px 0",
                            justifyItems: "center",
                        }}
                    >
                        {matchesList}
                    </div>
                </Paper>
                <Paper>
                    <Typography variant="h1">Latest Events</Typography>
                    {eventsList}
                </Paper>
                <Footer />
            </main>
        </>
    )
}