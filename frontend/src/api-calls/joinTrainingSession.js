export default async function joinTrainingSession(ccaId, sessionId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/training/${sessionId}/join/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // Add any required body data here
      }
    );
    if (!response.ok) {
      throw new Error("Failed to join training session");
    }
    const data = await response.json();
    console.log(
      "Here is the returned data from joinining the training session",
      data
    );
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
