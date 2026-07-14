import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: { resolve: () => void; reject: (e: unknown) => void }[] = [];

const flushQueue = (error: unknown | null) => {
  pendingQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  pendingQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Don't try to refresh the refresh call itself, and only handle 401 once per request
    if (error.response?.status !== 401 || original._retry || original.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      // Queue this request until the in-flight refresh finishes
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: () => resolve(api(original)),
          reject,
        });
      });
    }

    isRefreshing = true;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {}, { withCredentials: true });
      flushQueue(null);
      return api(original);
    } catch (refreshError) {
      flushQueue(refreshError);
      // Refresh token itself is dead — force logout
      window.location.href = "/";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;