import { API_BASE_URL } from "../config/api";

export default async function removeFromWishlist(productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/remove-wishlist/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to remove product from wishlist ", response);
    } else {
      console.log("Successfully removed product from wishlist ", response);
      return response;
    }
  } catch (error) {
    console.log("Failed to remove product from wishlist ", error);
  }
}
