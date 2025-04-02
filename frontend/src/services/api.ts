import axios from "axios";

const api =axios.create({
    baseURL:"http://localhost:5001/api/",
    withCredentials:true
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.error("Interceptor Error Triggered:", error);
      const originalRequest = error.config;
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const response = await api.post("user/refresh");
          console.log("Refresh response:", response);
          const newAccessToken = response.data.accessToken;
          api.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (Refresherror) {
          console.error("Refresh token failed:", Refresherror);
          // window.location.href="/login"
        }
      }
      return Promise.reject(error);
    }
  );
  
export default api;