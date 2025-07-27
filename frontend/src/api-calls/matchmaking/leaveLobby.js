import { API_BASE_URL } from "../../config/api";

export default async function leaveLobby(lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/leave/`,
      {
        method: "DELETE",
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
      console.log("Leave lobby response data: ", data);
    }
  } catch (error) {
    console.error("Error leaving lobby:", error);
  }
}
