import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSportMatch(tournamentId, sportId, matchId) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/matches/${matchId}/edit/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to update sport match: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully updated sport match: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to update sport match: ", err)
    }
}