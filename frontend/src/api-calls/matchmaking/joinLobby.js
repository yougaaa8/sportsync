import { API_BASE_URL } from "../../config/api";

export default async function joinLobby(lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/join/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.error("Failed to join lobby");
    } else {
      const data = await response.json();
      console.log("Join lobby response data: ", data);
      return data;
    }
  } catch (error) {
    console.error("Error joining lobby:", error);
  }
}
