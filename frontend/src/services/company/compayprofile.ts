import axios, { AxiosError } from "axios";
import { JobData } from "../../types/types";
const COMPANY_URI = "http://localhost:5001/api/company";


export const fetchCompany = async (userId: string) => {
  try {
    const response = await axios.get(`${COMPANY_URI}/company/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Comapny fething Error", error.response?.data);
    }
  }
};

export const postJob = async (companyId: string, data: JobData) => {
  try {
    const response = await axios.post(
      `${COMPANY_URI}/postjob/${companyId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job posting Error", error.response?.data);
    }
  }
};

export const fetchJob = async (companyId: string) => {
  try {
    const response = await axios.get(`${COMPANY_URI}/jobs/${companyId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job fetching Error", error.response?.data);
    }
  }
};

export const editJob = async (jobId: string, data: JobData) => {
  try {
    const respone = await axios.put(`${COMPANY_URI}/edit-job/${jobId}`,data);
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job editing Error", error.response?.data);
    }
  }
};

export const deleteJob= async(jobId:string)=>{
  try {
    const respone= await axios.delete(`${COMPANY_URI}/delete-job/${jobId}`)
    return respone.data
    
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job deleting Error", error.response?.data);
    }
  }
}

export const getApplicants=async(jobId:string,companyId:string)=>{
try {
  const respone= await axios.get(`${COMPANY_URI}/jobapplicants/${jobId}`,{
    params:{companyId}
  })
  return respone.data
} catch (error) {
  if (error instanceof AxiosError) {
    console.error("Applicants fetching Error", error.response?.data);
  }
}
}

export const getApplicantDetials=async(applicantId:string)=>{
  try {
    const respone=await axios.get(`${COMPANY_URI}/jobapplicants/details/${applicantId}`)
    return respone.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Applicants details fetching Error", error.response?.data);
    }
  }
}
