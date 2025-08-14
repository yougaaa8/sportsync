import { API_BASE_URL } from "../../config/api";

export default async function editEventDetails(formData, eventId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/event/${eventId}/edit/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error("Failed to edit event details");
    }
    const data = await response.json();
    console.log("Successfully edited event details: ", data);
    return data;
  } catch (error) {
    console.error("Error editing event details: ", error);
  }
}
