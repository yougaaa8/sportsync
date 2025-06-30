import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { pullTournamentData } from "../api-calls/pullTournamentData.js"
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import TournamentItem from "../components/TournamentItem.jsx";

export default function TournamentPage() {
    const [tournamentData, setTournamentData] = useState(null);
    
    // Pull tournaments data
    useEffect(() => {
        async function fetchData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchData();
    }, []);
    const tournamentList = tournamentData ? tournamentData.map(tournament => {
        return (
            <TournamentItem 
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                logo={tournament.logo}
                status={tournament.status}
                startDate={tournament.start_date}
                endDate={tournament.end_date}
                description={tournament.description}
            >
            </TournamentItem>
        );
    }) : null;  

    // // Pull tournament sports data
    // pullTournamentSportsData()

    // // Pull teams data
    // pullTournamentTeamsData()

    // // Pull team members data
    // pullTournamentMembersData()

    // // Pull matches data
    // pullTournamentMatchesData()
    
    return (
        <>
            <Navbar />
            <h1 className="page-title">NUS Tournaments</h1>
            {tournamentData ? tournamentList : null}
            <Footer />
        </>
    )
}