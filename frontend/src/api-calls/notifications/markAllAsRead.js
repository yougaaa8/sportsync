import { API_BASE_URL } from "../../config/api";

export default async function markAsRead() {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/mark-all-read/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to retrieve notifications: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully retrieved notifications: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to retrieve notifications: ", err)
    }
}