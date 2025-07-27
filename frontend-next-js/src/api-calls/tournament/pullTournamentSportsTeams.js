import { API_BASE_URL } from "../../config/api";

export default async function pullTournamentSportsTeams(tournamentId, sportId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to retrieve tournament sports teams: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully retrieved tournament sports teams: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to retrieve tournament sports teams: ", err);
  }
}
