export default async function leaveTrainingSession(ccaId, sessionId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/training/${sessionId}/leave/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      console.log("Failed to leave training session");
    }
    const data = await response.json();
    console.log(
      "Here is the returned data from leaving the training session: ",
      data
    );
    return data;
  } catch (error) {
    console.error("Error leaving training session:", error);
    throw error;
  }
}
