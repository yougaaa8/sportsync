import { API_BASE_URL } from "../../config/api";

export default async function addNewTeamMember(
  tournamentId,
  sportId,
  teamId,
  formData
) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/teams/${teamId}/create/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to add new team member: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully added new team member: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to add new team member: ", err);
  }
}
