import { jwtDecode } from "jwt-decode";

export function isTokenValid(token: string): boolean {
  try {
    console.log("Checking if this token is still valid: ", token)
    const decoded: { exp: number } = jwtDecode(token)
    const now = Date.now() / 1000
    return decoded.exp > now
  } catch (err) {
    console.log(err)
    return false;
  }
}
