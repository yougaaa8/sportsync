export async function pullTournamentData(arg) {
  try {
    const response = await fetch(
      "https://sportsync-backend-8gbr.onrender.com/api/tournament/list",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log("Tournaments data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching tournaments data: ", error);
  }
}
