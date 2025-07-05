export default async function pullWishlist() {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      "https://sportsync-backend-8gbr.onrender.com/api/merch/wishlist/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to retrieve wishlist for user ", response);
    } else {
      const data = await response.json();
      console.log("This is the retrieved wishlist: ", data);
      return data.items;
    }
  } catch (error) {
    console.log("Failed to retrieve wishlist for user ", error);
  }
}
