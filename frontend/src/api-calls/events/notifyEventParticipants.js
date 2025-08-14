import { API_BASE_URL } from "../../config/api";

export default async function notifyEventParticipants(formData, eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/event/${eventId}/notify-participants/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (!response.ok) {
      throw new Error("Failed to notify event participants");
    }
    const data = await response.json();
    console.log("Successfully notified event participants: ", data);
    return data;
  } catch (error) {
    console.error("Error notifying event participants: ", error);
  }
}
