import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import TournamentSportsItem from "../components/TournamentSportsItem.jsx"
import { pullTournamentData } from "../api-calls/pullTournamentData.js"


export default function TournamentSportsPage() {
    // Retrieve the tournament ID from the URL
    const { tournamentId } = useParams();

    // Set states
    const [tournamentSports, setTournamentSports] = useState(null);
    const [tournamentData, setTournamentData] = useState(null);

    const token = localStorage.getItem("authToken");

    // Fetch the tournament sports list
    useEffect(() => {
        const fetchTournamentSports = async () => {
            try {
                const response = await fetch(`https://sportsync-backend-8gbr.onrender.com/api/tournament/${tournamentId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tournament details");
                }
                const data = await response.json();
                setTournamentSports(data);   
                console.log("Tournament sports: ", data);
            } catch (error) {
                console.error(error);
            }
        };
        if (token) {
            fetchTournamentSports();
        }
        
    }, [tournamentId, token]);  

    // Fetch tournament data for the tournament name
    useEffect(() => {
        async function fetchData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchData();
    }, []);
    console.log("The tournament data: ", tournamentData)

    // Map the tournament sports list to JSX elements
    const tournamentSportsElements = tournamentSports ? tournamentSports.map((sport, idx) => (
        <TournamentSportsItem
            key={sport.id || idx}
            sport={sport.sport}
            gender={sport.gender}
            description={sport.description}
        />
    )) : null;


    return (
        <>
            <Navbar />
            { tournamentData && <h1 className="page-title">{tournamentData[tournamentId].name}</h1>}
            { tournamentSports ? tournamentSportsElements : <h1 className="page-title">Loading...</h1>}
            <Footer />
        </>
    )
}