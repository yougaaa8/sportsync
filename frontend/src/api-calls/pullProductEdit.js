import { API_BASE_URL } from "../config/api";

export default async function pullProductEdit(productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/edit/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error("Failed to retrieve product for editing: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully retrieved product for editing: ", data);
      return data;
    }
  } catch (error) {
    console.error("Failed to retrieve product for editing: ", error);
  }
}
