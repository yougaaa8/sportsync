import { API_BASE_URL } from "../config/api";

export default async function listNewProduct(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/merch/products/create/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.log("Failed to list new product: ", response);
    }
    const data = await response.json();
    console.log("Successfully listed new product: ", data);
    return data;
  } catch (error) {
    console.log("Failed to list new product: ", error);
  }
}
