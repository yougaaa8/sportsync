import { API_BASE_URL } from "../../config/api";

export default async function sendCCAAnnouncement(formData, ccaId) {
  const token = localStorage.getItem("authToken");

  // Extract data from FormData first
  const title = formData.get("title");
  const message = formData.get("message");

  // Debug: Log the token and form data
  console.log("Token from localStorage:", token);
  console.log("Token type:", typeof token);
  console.log("Token length:", token ? token.length : 0);
  console.log("FormData entries:", Object.fromEntries(formData.entries()));
  console.log("Extracted data:", { title, message, ccaId });

  if (!token) {
    console.error("No authentication token found in localStorage");
    throw new Error("No authentication token found");
  }

  try {
    // Convert FormData to JSON
    const requestBody = JSON.stringify({
      title: title,
      message: message,
    });

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log("Request headers:", headers);
    console.log("Request body:", requestBody);
    console.log(
      "Request URL:",
      `${API_BASE_URL}/api/cca/${ccaId}/announcement/`
    );

    const response = await fetch(
      `${API_BASE_URL}/api/cca/${ccaId}/announcement/`,
      {
        method: "POST",
        headers: headers,
        body: requestBody,
      }
    );

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: "Could not parse error response" };
      }

      console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      });

      throw new Error(
        `API Error: ${response.status} - ${
          errorData.detail || response.statusText
        }`
      );
    }

    const data = await response.json();
    console.log("Successfully sent CCA Announcement:", data);
    return data;
  } catch (err) {
    console.error("Failed to send CCA announcement:", err);
    throw err;
  }
}
