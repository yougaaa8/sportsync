const API_BASE_URL =
  import.meta.env.VITE_PRODUCTION === "true"
    ? import.meta.env.VITE_DEPLOYMENT
    : import.meta.env.VITE_LOCAL;

export { API_BASE_URL };
