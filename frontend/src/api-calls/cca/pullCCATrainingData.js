import { API_BASE_URL } from "../../config/api";

export default async function pullCCATrainingData(ccaId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/cca/${ccaId}/training/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("CCA Training Data not found");
    }

    const ccaTrainingData = await response.json();
    console.log("CCA Training Data successfully retrieved: ", ccaTrainingData);
    return ccaTrainingData;
  } catch (err) {
    console.log("An error has occured fetching: ", err);
  }
}
