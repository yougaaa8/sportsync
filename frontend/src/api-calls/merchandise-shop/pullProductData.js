import { API_BASE_URL } from "../../config/api";

export default async function pullProductData(productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to retrieve product data ", response);
    } else {
      const data = await response.json();
      console.log("Successfully retrieved product data: ", data);
      return data;
    }
  } catch (error) {
    console.log("Failed to retrieve product data ", error);
  }
}
