import { API_BASE_URL } from "../config/api";

export default async function pullMatchesData() {
  const token = localStorage.getItem("authToken");
  const fetchMatches = async () => {
    try {
      console.log("Fetching available matches...");
      const response = await fetch(`${API_BASE_URL}/api/matchmaking/lobbies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      console.log("Available matches data: ", data);
      return data;
    } catch (error) {
      console.error("Error fetching available matches:", error);
    }
  };

  if (token) {
    return await fetchMatches();
  }
}
