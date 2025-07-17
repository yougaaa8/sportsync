import { API_BASE_URL } from "../config/api";

export default async function pullEventDetails(eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch event details");
    }
    const data = await response.json();
    console.log("Event details: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching event details: ", error);
  }
}
