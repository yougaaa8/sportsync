import { API_BASE_URL } from "../../config/api";

export async function pullTournamentSportMatches(tournamentId, sportId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/matches/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) {
      console.log("Failed to retrieve matches: ", response)
    }
    else {
        const data = await response.json();
        console.log("Successfully retrieved matches data: ", data);
        return data;
    }
  } catch (error) {
    console.error("Error fetching matches data: ", error);
  }
}
