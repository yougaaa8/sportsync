import pullCCADetails from "./pullCCADetails";

export default async function pullUserCCANames() {
  // Get the cca IDs from local storage, parse it into a JS array
  const ccaIds = JSON.parse(localStorage.getItem("ccaIds"));

  // Map that into an array of CCA names
  const ccaNames = ccaIds.map(async (ccaId) => {
    return await pullCCADetails(ccaId);
  });

  // Return the array of CCA names
  return ccaNames;
}
