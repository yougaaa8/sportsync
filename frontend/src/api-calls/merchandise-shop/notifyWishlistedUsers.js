import { API_BASE_URL } from "../../config/api";

export default async function notifyWishlistedUsers(formData, productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/notify-wishlist/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to notify wishlisted users: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully notified wishlisted users: ", data);
      return data;
    }
  } catch (error) {
    console.log("Failed to notify wishlisted users: ", error);
  }
}
