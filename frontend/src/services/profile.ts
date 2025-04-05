import api from "./api"; 
import { AxiosError } from "axios";
import { Experience } from "../components/User/modals/AddExperience";
import { Education } from "../components/User/modals/AddEducation";

export const editProfile = async (userId: string, formData: FormData) => {
  try {
    const response = await api.put(`user/edit-profile/${userId}`, formData);
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit profile :", error?.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const getProfile = async (userId: string) => {
  try {
    const response = await api.get(`user/profile/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Get  profile :", error?.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const editAbout = async (userId: string, data: string) => {
  try {
    const response = await api.put(`user/edit-about/${userId}`, {
      about: data,
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit aboout :", error?.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const addExprience = async (userId: string, data: Experience) => {
  try {
    const response = await api.post(`user/add-experience/${userId}`, data);
    console.log(" the response data", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Add experince :", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const editExperience = async (userId: string, data: Experience) => {
  try {
    const response = await api.put(`user/edit-experience/${userId}`, data);
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Edit  experince :", error?.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const addEducation = async (userId: string, data: Education) => {
  try {
    const response = await api.post(`user/add-education/${userId}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Add education :", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const editEducation = async(userId:string,data:Education)=>{
  try {
    const response = await api.put(`user/edit-education/${userId}`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Edit education :", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");
  }
};

export const addSkill = async (userId: string, skills: string[]) => {
  try {
    const response = await api.post(`user/add-skill/${userId}`, {skills});
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Add skill:", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");       
  }
};

export const uploadResume=async ( userid:string,data:string)=>{
  try {
    const response= await api.post(`user/upload-resume/${userid}`,data)
    console.log(" the response data",response.data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Uplaoding resume:", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again.");       
  }
};

export const deleteResume= async(userId:string)=>{
  try {
    const response = await api.delete(`user/delete-resume/${userId}`)
    return response.data  
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(" Uplaoding resume:", error);
      throw new Error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
    throw new Error("Something went wrong. Please try again."); 
  }
};


export const getSubscriptionHistory=async(userId:string)=>{
  try {
    const response=await api.get(`user/subscription-history/${userId}`)
  return  response.data

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Subscription History:", error.response?.data);
    }
  }
}