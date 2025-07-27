"use client"

import { useEffect, useState } from "react"
import pullTournamentSportsTeams from "../../../../../api-calls/tournament/pullTournamentSportsTeams"
import TournamentSportsTeamItem from "@/components/tournament/TournamentSportsTeamItem"
import { TournamentSportTeam } from "@/types/TournamentTypes"

export default function TournamentSportTeams({ params }: {
    params: Promise<{
        tournamentId: string,
        sportId: string
    }>
}) {
    // Set states
    const [teams, setTeams] = useState<TournamentSportTeam[]>([])
    const [resolvedParams, setResolvedParams] = useState<{ tournamentId: string, sportId: string } | null>(null)

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
            <>
                <TournamentSportsTeamItem key={index} team={team}/>
            </>
        )
    })

    return (
        <>
            <h1>Sports Teams</h1>
            {teamList}
        </>
    )
}