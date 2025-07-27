import { API_BASE_URL } from "../../config/api";

export default async function deleteProfilePicture() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/profile/picture/delete/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to delete profile picture: ", response);
    } else {
      console.log("Successfully deleted profile picture");
      const data = response.json();
      console.log(
        "This is the returned data from delete profile picture: ",
        data
      );
      return data;
    }
  } catch (err) {
    console.log("Failed to delete profile picture: ", err);
  }
}
