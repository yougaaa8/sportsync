import { API_BASE_URL } from "../../config/api";

export default async function editTournament(tournamentId, formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/edit/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to update tournament details: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully changed tournament details: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to update tournament details: ", err);
  }
}
