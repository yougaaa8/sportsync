import { API_BASE_URL } from "../../config/api";

export default async function pullCCAMembersList(ccaId) {
  const token = localStorage.getItem("authToken");

  try {
    const response = await fetch(`${API_BASE_URL}/api/cca/${ccaId}/members/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("CCA not found");
    }

    const membersData = await response.json();
    console.log("CCA Members Data retrieved successfully: ", membersData);
    return membersData;
  } catch (err) {
    console.error("Error fetching CCA members:", err);
    throw err; // Re-throw so the caller can handle it
  }
}
