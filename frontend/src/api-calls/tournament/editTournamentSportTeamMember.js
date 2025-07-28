import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSportTeam(tournamentId, sportId, teamId, teamMemberId, formData) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/${teamId}/${teamMemberId}/edit/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!response.ok) {
            console.log("Failed to update team member details: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully updated team member details: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to update team member details: ", err)
    }
}