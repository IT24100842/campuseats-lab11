// ── Slide 32: Axios best practices ───────────────────────────────
// ONE configured axios instance for the whole app. Components never
// call axios directly – they call feature api.js functions that use
// this client. Benefits: single base URL, shared headers, one place
// for auth tokens and error logging.
import axios from "axios";

// ── Lab 11: production configuration ─────────────────────────────
// The backend URL is NOT hard-coded. It comes from VITE_API_URL, which is
// set per environment (Vercel/Netlify dashboard in production). Vite bakes
// it in at BUILD time, so redeploy the frontend after changing it.
// Locally it is left empty and the Vite dev proxy forwards /api.
const API = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export const apiClient = axios.create({
  baseURL: `${API}/api`,
  timeout: 15000, // free-tier backends can cold-start slowly
});

// REQUEST interceptor – attaches the real JWT issued by the API.
apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem("campuseats-user");
  if (raw) {
    const user = JSON.parse(raw);
    if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// RESPONSE interceptor – central place to log / map errors.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("[API error]", error.config?.url, error.message);
    return Promise.reject(error);
  }
);
