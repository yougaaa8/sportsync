"use client"
import { useEffect, useState } from "react"
import pullTournamentSportsTeamMembers from "../../../../../../api-calls/tournament/pullTournamentSportsTeamMembers"
import TeamMemberItem from "../../../../../../components/tournament/TeamMemberItem"

export default function TournamentSportTeamMembers({ params }: {
    params: Promise<{
        tournamentId: string,
        sportId: string,
        teamId: string
    }>
}) {
    // Set states
    const [members, setMembers] = useState([])
    const [resolvedParams, setResolvedParams] = useState<{
        tournamentId: string,
        sportId: string,
        teamId: string
    } | null>(null)

    // Resolve params
    useEffect(() => {
        const resolveParams = async () => {
            setResolvedParams(await params)
        }
        resolveParams()
    })

    // Pull the team members
    useEffect(() => {
        const fetchMembers = async () => {
            setMembers(await pullTournamentSportsTeamMembers(resolvedParams?.tournamentId, resolvedParams?.sportId, resolvedParams?.teamId))
        }
        fetchMembers()
    })

    // Map the team members 
    const membersList = members?.map((member, index) => {
        <TeamMemberItem key={index} member={member}/>
    })

    return (
        <>
            <h1>Team Members</h1>
            {membersList}
        </>
    )
}