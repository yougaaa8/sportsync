import { API_BASE_URL } from "../../config/api";

export default async function createEvent(formData) {
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch(`${API_BASE_URL}/api/event/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.get("name"),
        date: formData.get("date"),
        // location: formData.get("location"),
        registration_deadline: formData.get("registrationDeadline"),
        description: formData.get("description"),
        registration_fee: parseFloat(formData.get("registrationFee")),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create event");
    }

    const data = await response.json();
    console.log("Event created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating event:", error);
  }
}
