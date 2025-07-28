import { API_BASE_URL } from "../../config/api";

export default async function createNewSportMatch(tournamentId, sportId, formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/matches/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.log("Failed to create new sport match: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully created new sport match: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to create new sport match: ", err);
  }
}
