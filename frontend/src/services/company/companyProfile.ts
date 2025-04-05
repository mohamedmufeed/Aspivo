import { AxiosError } from "axios";
import api from "../api";
import { IComapny } from "../../types/types";
import { FormData } from "../../components/Company/Modals/EditCompanyDescriptionModal";
import { string } from "zod";


export const getComapny = async (companyId: string) => {
  try {
    const response = await api.get(`company/company-profile/${companyId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Geting company profile:", error.response?.data);
    }
  }
};

export  const editCompanyProfile=async(companyId:string,data:IComapny)=>{
  try {
    const response=await api.post(`company/edit-companyprofile/${companyId}`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit company Profile :", error.response?.data);
    }
  }
}


export const companyByuserId=async(userId:string)=>{
  try {
    const response=await api.get(`/company/company/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("get company Profile :", error.response?.data);
    }
  }
}

export const editCompanyDescription=async(companyId:string,data:FormData)=>{
  try {
    const response=await api.post(`company/edit-comapnydescription/${companyId}`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit company description :", error.response?.data);
    }
  }
}

export const addTechStack=async(companyId:string,data:string[])=>{
try {
  const response=await api.post(`company/add-comapnytechstack/${companyId}`,data)
  return response.data
} catch (error) {
  if (error instanceof AxiosError) {
    console.error("Add company tech stack :", error.response?.data);
  }
}
}