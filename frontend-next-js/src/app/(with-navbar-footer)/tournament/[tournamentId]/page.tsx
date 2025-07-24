"use client"

import { useState, useEffect } from "react";
import TournamentSportsItem from "../../../../components/tournament/TournamentSportsItem"
import { pullTournamentData } from "../../../../api-calls/tournament/pullTournamentData.js"
import { pullTournamentSportsData } from "../../../../api-calls/tournament/pullTournamentSportsData.js";
import { TournamentSport, Tournament } from "../../../../types/TournamentTypes"

export default function TournamentSportsPage({params}: {
    params: Promise<{
        tournamentId: string
    }>
}) {

    // Set states
    const [tournamentSports, setTournamentSports] = useState<TournamentSport[] | null>(null);
    const [tournamentData, setTournamentData] = useState<Tournament[] | null>(null);
    const [tournamentIdState, setTournamentIdState] = useState<number | null>(null)

    // Resolve the params
    useEffect(() => {
        const resolveParams = async () => {
            const { tournamentId } = await params
            console.log("This is the tournament id: ", tournamentId)
            setTournamentIdState(parseInt(tournamentId))
        }
        resolveParams()
    }, [params])

    const token = localStorage.getItem("authToken");

    // Fetch the tournament sports list
    useEffect(() => {
        const fetchTournamentSports = async () => {
            setTournamentSports(await pullTournamentSportsData(tournamentIdState))
        };
        if (token && tournamentIdState) {
            fetchTournamentSports();
        }
    }, [tournamentIdState, token]);  

    // Fetch tournament data for the tournament name
    useEffect(() => {
        async function fetchData() {
            const data = await pullTournamentData();
            setTournamentData(data);
        }
        fetchData();
    }, []);

    // Map the tournament sports list to JSX elements
    const tournamentSportsElements = tournamentSports ? tournamentSports.map((sport, idx) => (
        <TournamentSportsItem
            key={sport.id || idx}
            id={sport.id}
            sport={sport.sport}
            gender={sport.gender}
            description={sport.description}
            tournament={sport.tournament}
        />
    )) : null;

    // Resolve the name of the tournament from the extracted tournament data
    const name = tournamentData?.find(tournament => tournament.id === tournamentIdState)?.name

    return (
        <>
            { tournamentData && tournamentIdState && <h1 className="page-title">{name}</h1>}
            { tournamentSports ? tournamentSportsElements : <h1 className="page-title">Loading...</h1>}
        </>
    )
}