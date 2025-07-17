import { API_BASE_URL } from "../config/api";

export default async function leaveEvent(eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/event/${eventId}/leave/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          event: eventId,
          user: localStorage.getItem("userId"),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData);
      throw new Error("Failed to leave event");
    }

    console.log("Successfully left event:");
  } catch (error) {
    console.error("Error leaving event:", error);
  }
}
