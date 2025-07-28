import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSportTeam(tournamentId, sportId, teamId, teamMemberId) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/${teamId}/${teamMemberId}/edit/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to delete team member: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully deleted team member: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to delete team member: ", err)
    }
}