import { API_BASE_URL } from "../../config/api";

export default async function addCcaMember(ccaId, data) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/cca/${ccaId}/members/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Cannot add new member");
    }
    console.log("CCA member added, here's the POST response: ", response);
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Reload the page after 1 second to show the new member
  } catch (err) {
    console.log(`Catch block error: ${err}`);
  }
}
