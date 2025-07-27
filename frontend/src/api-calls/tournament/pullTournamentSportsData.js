import { API_BASE_URL } from "../../config/api";

export async function pullTournamentSportsData(tournamentId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tournament details");
    }
    const data = await response.json();
    console.log("Tournament sports: ", data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
