import { API_BASE_URL } from "../../config/api";

export default async function createMatchLobby(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.get("name"),
          description: formData.get("description"),
          sport: formData.get("sport"),
          date: formData.get("date"),
          start_time: formData.get("startTime"),
          end_time: formData.get("endTime"),
          location: formData.get("location"),
          open_lobby: formData.get("openLobby") === "Yes",
          password: formData.get("password"),
          max_capacity: parseInt(formData.get("maxCapacity"), 10),
        }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to create lobby");
    } else {
      const data = response.json();
      return data;
    }
  } catch (error) {
    console.error("Error creating lobby:", error);
  }
}
