import { API_BASE_URL } from "../../config/api";

export default async function updateNotificationPreferences(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/preferences/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to update notification preferences: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully updated notification preferences: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to update notification preferences: ", err);
  }
}
