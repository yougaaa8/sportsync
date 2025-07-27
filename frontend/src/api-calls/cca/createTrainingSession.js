import { API_BASE_URL } from "../../config/api";

export default async function createTrainingSession(ccaId, formData) {
  const token = localStorage.getItem("authToken");
  console.log("This is the formData: ", formData);
  try {
    const response = await fetch(`${API_BASE_URL}/api/cca/${ccaId}/training/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      console.error("Failed to create new training session: ", response);
    } else {
      const data = await response.json();
      console.log("Succesfully retrieved new training session: ", data);
      return data;
    }
  } catch (error) {
    console.error("Failed to create new training session: ", error);
  }
}
