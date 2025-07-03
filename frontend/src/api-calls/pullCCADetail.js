export default async function pullCCADetail(ccaId) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("CCA not found");
    }

    const data = await response.json();
    // setCcaData(data);
    console.log("CCA data retrieved");
    return data;
  } catch (err) {
    console.log(err.message);
  }
}
