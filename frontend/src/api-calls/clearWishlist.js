import { API_BASE_URL } from "../config/api";

export default async function clearWishlist(userId) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/merch/wishlist/clear/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to clear user's wishlist: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully cleared user's wishlist: ", data);
      return data;
    }
  } catch (error) {
    console.error("Failed to clear user's wishlist: ", error);
  }
}
