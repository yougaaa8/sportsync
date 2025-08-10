import { API_BASE_URL } from "../../config/api";

export default async function pullNotificationCount() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/notifications/unread-count/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to retrieve notification count: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully retrieved notification count: ", data);
      return data;
    }
  } catch (err) {
    console.log("Failed to retrieve notification count: ", err);
  }
}
