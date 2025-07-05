export default async function addToWishlist(productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `https://sportsync-backend-8gbr.onrender.com/api/merch/products/${productId}/wishlist/`,
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
    console.log("Failed to add product to wishlist ", response);
  }
}
