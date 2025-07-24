import { API_BASE_URL } from "../../config/api";

export default async function logout(refresh) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/auth/logout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (response.ok) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("email");
      const data = response.json();
      return data;
    } else {
      console.error("Logout failed with status: ", response.status);
      console.log("The logged in user is: ", localStorage.getItem("email"));
    }
  } catch (err) {
    console.error("Network error during logout:", err);
  }
}
