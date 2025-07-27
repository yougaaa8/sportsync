import { API_BASE_URL } from "../../config/api";

export default async function pullTournamentSportsTeamMembers(
  tournamentId,
  sportId,
  teamId
) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/${sportId}/${teamId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log(
        "Failed to retrieve tournament sport team members: ",
        response
      );
    } else {
      const data = response.json();
      console.log(
        "Successfully retrieved tournament sports team members: ",
        data
      );
      return data;
    }
  } catch (err) {
    console.log("Failed to retrieve tournament sport team members: ", err);
  }
}
