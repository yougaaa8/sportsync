import { API_BASE_URL } from "../../config/api";

export default function pullCCAList() {
  const token = localStorage.getItem("authToken");
  return fetch(`${API_BASE_URL}/api/cca/list/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok)
        throw new Error(`Response: ${response.status} ${response.statusText}`);
      return response.json();
    })
    .then((data) => data)
    .catch((err) => console.error("CCA List fetch error: ", err));
}
