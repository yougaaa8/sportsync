import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSportTeam(tournamentId, sportId, teamId, formData) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/${teamId}/edit`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
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