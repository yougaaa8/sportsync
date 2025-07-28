import { API_BASE_URL } from "../../config/api";

export default async function markAsRead(notificationId) {
    const token = localStorage.getItem("authToken")
    try {
        const response = await fetch(`${API_BASE_URL}/api/notifications/${notificationId}/read/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!response.ok) {
            console.log("Failed to read notification as read: ", response)
        }
        else {
            const data = await response.json()
            console.log("Successfully read notification as read: ", data)
            return data
        }
    }
    catch (err) {
        console.log("Failed to read notification as read: ", err)
    }
}