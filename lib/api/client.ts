import axios, { AxiosError, AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});

// ─── REQUEST INTERCEPTOR ──────────────────────────────────────
// Ajoute le token automatiquement sur chaque requête
apiClient.interceptors.request.use(
  (config) => {
    // Récupérer le token depuis localStorage
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("skillforge_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────
// Gère les erreurs globalement
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide → déconnexion
      if (typeof window !== "undefined") {
        localStorage.removeItem("skillforge_token");
        localStorage.removeItem("skillforge_user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
