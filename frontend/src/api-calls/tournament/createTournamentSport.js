import { API_BASE_URL } from "../../config/api";

export default async function createTournamentSport(tournamentId, formData) {
  const token = localStorage.getItem("authToken");
  formData.append("tournament", tournamentId);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/create/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to create new tournament sport: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully created new tournamnent sport: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to create new tournament sport: ", err);
  }
}
