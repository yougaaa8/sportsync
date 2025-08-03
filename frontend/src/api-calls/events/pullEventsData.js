import { API_BASE_URL } from "../../config/api";

export async function pullEventsData(router) {
  try {
    const token = localStorage.getItem("authToken");
    const response = await fetch(`${API_BASE_URL}/api/event/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      router.push("/login");
    } else {
      const data = await response.json();
      console.log("Events data: ", data);
      return data;
    }
  } catch (error) {
    console.error(error);
  }
}

// Usage in your component:
// const router = useRouter();
// const data = await pullEventsData(router);
