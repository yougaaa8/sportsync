import { API_BASE_URL } from "../config/api";

export default async function pullProductList() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/merch/products/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to retrieve product list: ", response);
    } else {
      console.log("Successfully retrieved product list");
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.error("Failed to retrieve product list: ", error);
  }
}
