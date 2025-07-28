import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSport(tournamentId, sportId) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/edit/`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to delete tournament sport: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully deleted tournament sport: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to delete tournament sport: ", err)
    }
}