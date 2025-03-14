import axios from "axios";

const api =axios.create({
    baseURL:"http://localhost:5001/api/user",
    withCredentials:true
})

api.interceptors.response.use(
    (response)=>response,
    async(error)=>{
        const originalRequest=error.config
        if(error.response?.status===401 &&originalRequest._retry){
            originalRequest._retry = true;
            try {
                await api.post("/refresh")
                return api(originalRequest)
            } catch (Refresherror) {
                console.error("Refresh token failed:", Refresherror);
            }
        }
        return Promise.reject(error);
    }
)
export default api;