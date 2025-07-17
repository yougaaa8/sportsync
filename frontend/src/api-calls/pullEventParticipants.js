import { API_BASE_URL } from "../config/api";

export default async function pullEventParticipants(eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/event/${eventId}/participants/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch event participants");
    }
    const data = await response.json();
    console.log("Event participants: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching event participants: ", error);
  }
}
