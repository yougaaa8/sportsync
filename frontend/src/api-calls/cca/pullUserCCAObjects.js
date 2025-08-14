import pullCCADetails from "./pullCCADetails";

export default async function pullUserCCAObjects() {
  // Get the cca IDs from local storage, parse it into a JS array
  const ccaIds = JSON.parse(localStorage.getItem("ccaIds"));

  // Await all promises to resolve and return the actual CCA details
  const ccaDetails = await Promise.all(
    ccaIds.map(async (ccaId) => await pullCCADetails(ccaId))
  );

  return ccaDetails;
}
