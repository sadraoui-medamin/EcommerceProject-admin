const backendUrl = import.meta.env.VITE_API_URL;

export const apiBaseUrl = backendUrl?.replace(/\/$/, "");

export default apiBaseUrl;
