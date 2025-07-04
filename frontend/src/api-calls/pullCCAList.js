export default function pullCCAList() {
  const token = localStorage.getItem("authToken");
  fetch("https://sportsync-backend-8gbr.onrender.com/api/cca/list/", {
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
    .then((data) => setCcas(data))
    .catch((err) => console.error("CCA List fetch error: ", err));
}
