import { API_BASE_URL } from "../config/api";

export default async function updateLobbyDetails(formData, lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    console.log("I am inside the try block");
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/`,
      {
        method: "PUT",
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
      const errorData = await response.json();
      console.error("Failed to update lobby:", errorData);
    } else {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Failed to update lobby with error:", error);
  }
}
