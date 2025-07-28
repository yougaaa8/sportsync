import { API_BASE_URL } from "../../config/api";

export default async function addNewTeam(tournamentId, sportId, formData) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/create/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (!response.ok) {
            console.log("Failed to create new team: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully created new team: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to create new team: ", err)
    }
}
