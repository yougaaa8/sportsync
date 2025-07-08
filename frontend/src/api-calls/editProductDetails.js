import { API_BASE_URL } from "../config/api";

export default async function editProductDetails(productId, formData) {
  const token = localStorage.getItem("authToken");
  // Determine if the API call is for a PUT or PATCH update
  let putOrPatch = "PUT";
  for (const [key, value] of formData.entries()) {
    if (!value) {
      putOrPatch = "PATCH";
    }
  }

  // If formData's images field is empty, just delete that field
  if (
    !formData.getAll("uploaded_images").filter((file) => file && file.size > 0)
      .length
  ) {
    formData.delete("uploaded_images");
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/merch/products/${productId}/edit/`,
      {
        method: putOrPatch,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      console.log("Failed to update product details: ", response);
    } else {
      const data = await response.json();
      console.log("Successfully updated product details: ", data);
      return data;
    }
  } catch (error) {
    console.log("Failed to update product details: ", error);
  }
}
