import { AxiosError } from "axios"
import api from "./api"
import { USER_BASE_ROUTE } from "../constants/apiRoutes"

export const addReview = async (userId: string, review: string) => {
    try {
        const response = await api.post(`${USER_BASE_ROUTE}/users/${userId}/add-review`, { review })
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on adding review", error.response?.data)
        }
    }
}


export const getReview = async()=>{
    try {
        const response=await api.get(`${USER_BASE_ROUTE}/users/get-review`)
        return response.data
        
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Error on fetching review", error.response?.data)
        }
    }
}