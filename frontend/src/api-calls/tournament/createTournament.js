import { API_BASE_URL } from "../../config/api";

export default async function createTournament(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/tournament/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.log("Failed to create new tournament: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully created new tournament: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to create new tournament: ", err);
  }
}
