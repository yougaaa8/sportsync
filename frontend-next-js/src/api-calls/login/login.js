import { API_BASE_URL } from "../../config/api";

export default async function login(email, password) {
  // const token = localStorage.getItem("authToken");
  const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  console.log("I just finished fetching from API");
  const data = await response.json();
  return data;
}
