import axios, { AxiosError } from "axios";
const USER_API = "http://localhost:5001/api/user";
 import { Experience } from "../components/modals/AddExperience";


export const editProfile=async (userId:string,formData:FormData)=>{
try {
    const response = await axios.put(`${USER_API}/edit-profile/${userId}`, formData);
    console.log(response)
    return response.data

} catch (error) {
    
    if (error instanceof AxiosError) {
        console.error("Edit profile :", error?.response?.data);
        throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
      }
  
      throw new Error("Something went wrong. Please try again.");
}
}


 export  const getProfile =async (userId:string)=>{
    try {
        
        const response= await axios.get(`${USER_API}/profile/${userId}`)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Get  profile :", error?.response?.data);
            throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
          }
      
          throw new Error("Something went wrong. Please try again.");
    }
 }


 export const editAbout = async(userId:string,data:string)=>{
    try {
        const response =await axios.put(`${USER_API}/edit-about/${userId}`,{about:data})
        console.log(response.data)
        return response.data

      
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Edit aboout :", error?.response?.data);
            throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
          }
      
          throw new Error("Something went wrong. Please try again.");
    }
} 

 export const addExprience= async(userId:string,data:Experience)=>{

    try {
         const  response= await axios.post(`${USER_API}/add-experience/${userId}`,data)
         console.log(" the response data",response.data)

         return response.data
        
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(" Add experince :", error);
            throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
          }
      
          throw new Error("Something went wrong. Please try again.");
    }
 }


  export const editExperience = async(userId:string,data:Experience)=>{
    try {
        const response= await axios.put(`${USER_API}/edit-experience/${userId}`,data)
        console.log(response.data)
        return response.data
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error(" Edit  experince :", error?.response?.data);
            throw new Error(error.response?.data?.message || "Something went wrong. Please try again.");
          }
      
          throw new Error("Something went wrong. Please try again.");
    }
  }