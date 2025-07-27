import { TournamentSportTeamMember } from "@/types/TournamentTypes"
import { Paper } from "@mui/material"

export default function TeamMemberItem(props: {
    member: TournamentSportTeamMember
}) {
    return (
        <>
            <Paper>
                <h1>{props.member.jersey_name}</h1>
            </Paper>
        </>
    )
}