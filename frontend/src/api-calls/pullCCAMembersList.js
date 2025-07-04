export default function pullCCAMembersList(ccaId) {
  const token = localStorage.getItem("authToken");
  const fetchCcaMembersData = async () => {
    try {
      const response = await fetch(
        `https://sportsync-backend-8gbr.onrender.com/api/cca/${ccaId}/members/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("CCA not found");
      }

      const membersData = await response.json();
      console.log("CCA Members Data retrieved");
      return membersData;
    } catch (err) {
      setCcaMembersDataError(err);
    }
  };
  fetchCcaMembersData();
}
