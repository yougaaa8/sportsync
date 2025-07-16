import { API_BASE_URL } from "../config/api";

export default async function pullUserProfileFromEmail(email) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(
      `${API_BASE_URL}/api/get-user-profile/?email=${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Cannot fetch user by email");
    }
    const userIdData = await response.json();
    console.log("The retrieved user profile is: ", userIdData);
    return userIdData;
  } catch (err) {
    console.log("Error fetching user by email ", err);
    return;
  }
}
