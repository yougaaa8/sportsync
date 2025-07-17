import { API_BASE_URL } from "../config/api";

export default async function pullMatchMembers(lobbyId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/matchmaking/lobbies/${lobbyId}/members/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Match members not found");
    }

    const data = await response.json();
    console.log("Match members retrieved: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching match members: ", error);
  }
}
