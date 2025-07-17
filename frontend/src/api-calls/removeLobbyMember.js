import { API_BASE_URL } from "../config/api";

export default async function removeLobbyMember(lobbyId, userId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/members/${userId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.log("Failed to remove member");
      return false;
    } else {
      console.log("Successfully removed member");
      return true;
    }
  } catch (error) {
    console.error("Error removing member:", error);
    return false;
  }
}
