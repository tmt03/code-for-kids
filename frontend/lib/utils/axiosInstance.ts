import axios from "axios";
import { API_ROOT } from "./constants";

const axiosInstance = axios.create({
  baseURL: API_ROOT,
  withCredentials: true, // 👈 để gửi kèm cookie
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          `${API_ROOT}/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        const newToken = response.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // retry
      } catch (err) {
        console.log("Refresh thất bại, chuyển về login");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
