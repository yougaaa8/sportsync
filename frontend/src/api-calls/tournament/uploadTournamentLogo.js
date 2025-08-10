import { API_BASE_URL } from "../../config/api";

export default async function sendTournamentAnnouncement(
  formData,
  tournamentId
) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/tournament/${tournamentId}/upload-logo/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to upload tournament logo: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully uploaded tournament logo: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to upload tournament logo: ", err);
  }
}
