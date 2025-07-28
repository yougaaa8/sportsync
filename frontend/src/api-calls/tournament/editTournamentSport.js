import { API_BASE_URL } from "../../config/api";

export default async function editTournamentSport(tournamentId, sportId, formData) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/edit/`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!response.ok) {
            console.log("Failed to update tournament sport details: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully updated tournament sport details: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to update tournament sport details: ", err)
    }
}