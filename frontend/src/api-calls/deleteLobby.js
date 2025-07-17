import { API_BASE_URL } from "../config/api";

export default async function deleteLobby(lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to delete lobby", response);
    } else {
      console.log("Successfully deleted lobby");
      return response;
    }
  } catch (error) {
    console.log("Failed to delete lobby", error);
  }
}
