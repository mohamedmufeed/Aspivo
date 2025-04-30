import { AxiosError } from "axios"
import api from "./api"

export const addReview = async (userId: string, review: string) => {
    try {
        const response = await api.post(`user/users/${userId}/add-review`, { review })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on adding review", error.response?.data)
        }
    }
}


export const getReview = async()=>{
    try {
        const response=await api.get(`user/users/get-review`)
        return response.data
        
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching review", error.response?.data)
        }
    }
}