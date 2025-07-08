import { API_BASE_URL } from "../config/api";

export default async function addToWishlist(productId) {
  const token = localStorage.getItem("authToken");
  console.log("All env vars: ", import.meta.env);
  console.log("API_BASE_URL: ", API_BASE_URL);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/wishlist/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to add product to wishlist ", response);
    } else {
      console.log("Added product to wishlist");
    }
  } catch (error) {
    console.log("Failed to add product to wishlist ", error);
  }
}
