import { API_BASE_URL } from "../../config/api";

export default async function register(
  email,
  first_name,
  last_name,
  password,
  confirmPassword
) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      first_name: first_name,
      last_name: last_name,
      password: password,
      password_confirm: confirmPassword,
    }),
  });
  if (response) {
    const data = await response.json();
    console.log("Successfully registered: ", data);
    return data;
  } else {
    console.error("Failed to register: ", response);
  }
}
