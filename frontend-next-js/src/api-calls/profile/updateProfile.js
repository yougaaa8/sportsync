import { API_BASE_URL } from "../../config/api";

export default async function updateProfile(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const res = await fetch(`${API_BASE_URL}/api/profile/update/`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      console.log("ashkfhaksdhfkjahsdkfhajkj");
      // setMessage("Profile updated successfully!")
      window.location.reload();
    } else {
      // setMessage("Failed to update: " + JSON.stringify(data))
    }
  } catch (error) {
    console.error(error);
    // setMessage("An error occured while updating profile.")
  }
}
