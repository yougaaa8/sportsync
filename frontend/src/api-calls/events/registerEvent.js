import { API_BASE_URL } from "../../config/api";

export default async function registerEvent(eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/event/${eventId}/signup/`,
      {
        method: "POST",
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
      throw new Error("Failed to register for event");
    }

    const data = await response.json();
    console.log("Registration successful:", data);
    return data;
  } catch (error) {
    console.error("Error registering for event:", error);
  }
}
