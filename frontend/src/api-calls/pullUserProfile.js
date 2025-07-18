import { API_BASE_URL } from "../config/api";

export async function pullUserProfile(tournamentId) {
  const token = localStorage.getItem("authToken");
  if (!token) return;
  return fetch(`${API_BASE_URL}/api/profile/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
