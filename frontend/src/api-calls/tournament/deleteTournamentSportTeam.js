import { API_BASE_URL } from "../../config/api";

export default async function deleteTournamentSportTeam(tournamentId, sportId, teamId) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/${teamId}/edit`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to update team details: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully updated team details: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to update team details: ", err)
    }
}