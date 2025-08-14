import { API_BASE_URL } from "../../config/api";

export default async function editMerchandiseDetails(formData, productId) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/edit/`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to update product data ", response);
    } else {
      const data = await response.json();
      console.log("Successfully updated product data: ", data);
      return data;
    }
  } catch (error) {
    console.log("Failed to update product data ", error);
  }
}
