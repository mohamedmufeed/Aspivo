import { AxiosError } from "axios";
import api from "../api";
import { IComapny } from "../../types/types";
import { FormData } from "../../components/Company/Modals/EditCompanyDescriptionModal";
import { string } from "zod";
import { TeamMember } from "../../components/Company/Modals/EditCompanyTeamModal";
import { ContactUrl } from "../../components/Company/Modals/EditContactModal";
export interface EditTeamPayload {
  members: TeamMember[];
}

export interface EditContactPayload{
  contact: ContactUrl[]
}

export const getComapny = async (companyId: string) => {
  try {
    const response = await api.get(`company/profile/${companyId}`);
    console.log("ptfilr respoe",response)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Geting company profile:", error.response?.data);
    }
  }
};

export  const editCompanyProfile=async(companyId:string,data:IComapny)=>{
  try {
    const response=await api.put(`company/profile/${companyId}`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit company Profile :", error.response?.data);
    }
  }
}


export const companyByuserId=async(userId:string)=>{
  try {
    const response=await api.get(`company/${userId}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("get company Profile :", error.response?.data);
    }
  }
}

export const editCompanyDescription=async(companyId:string,data:FormData)=>{
  try {
    const response=await api.patch(`company/profile/${companyId}/description`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit company description :", error.response?.data);
    }
  }
}

export const addTechStack=async(companyId:string,data:string[])=>{
try {
  const response=await api.put(`company/profile/${companyId}/techstack`,data)
  return response.data
} catch (error) {
  if (error instanceof AxiosError) {
    console.error("Add company tech stack :", error.response?.data);
  }
}
}

export const editTeam=async(companyId:string,data:EditTeamPayload)=>{
try {
  const response=await api.put(`company/profile/${companyId}/team`,data)
  return response.data
  
} catch (error) {
  if (error instanceof AxiosError) {
    console.error("Edit company team :", error.response?.data);
  }
}
}
export const editContact=async(companyId:string,data:EditContactPayload)=>{
  try {
    const response=await api.put(`company/profile/${companyId}/contact`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Edit company contact :", error.response?.data);
    }
  }
}