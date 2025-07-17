import { API_BASE_URL } from "../config/api";

export default async function pullMatchesData(lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Match details not found");
    }

    const data = await response.json();
    console.log("Match details retrieved: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching match details: ", error);
  }
}
