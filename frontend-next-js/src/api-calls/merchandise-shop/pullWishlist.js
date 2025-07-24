import { API_BASE_URL } from "../../config/api";

export default async function pullWishlist() {
  const token = localStorage.getItem("authToken");
  console.log("This is the token: ", token);

  try {
    const response = await fetch(`${API_BASE_URL}api/merch/wishlist/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Only add if token exists
      },
      credentials: "include", // This includes cookies for session auth
    });

    if (!response.ok) {
      console.log("Failed to retrieve wishlist for user ", response);
    } else {
      console.log("response okay");
      const data = await response.json();
      console.log("This is the retrieved wishlist: ", data);
      return data.items;
    }
  } catch (error) {
    console.log("Failed to retrieve wishlist for user ", error);
  }
}
