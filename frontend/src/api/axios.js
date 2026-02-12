import axios from "axios";

export const api = axios.create({
  baseURL: "https://appointment-saas.onrender.com",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // If there's no response (network error), just reject
    if (!error.response) return Promise.reject(error);

    // ✅ Don't try to refresh if the failing call IS the refresh endpoint
    const isRefreshCall = original?.url?.includes("/api/auth/refresh");

    if (error.response.status === 401 && !original._retry && !isRefreshCall) {
      original._retry = true;

      try {
        const refreshRes = await api.post("/api/auth/refresh");
        const newToken = refreshRes.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        original.headers.Authorization = `Bearer ${newToken}`;

        return api(original);
      } catch (e) {
        localStorage.removeItem("accessToken");
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);
