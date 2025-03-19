import axios, { AxiosError } from "axios";

const COMPANY_URI = "http://localhost:5001/api/company";
 export interface JobData {
  jobTitle: string;
  category: string;
  typesOfEmployment: string[];
  maximumSalary: number;
  minimumSalary: number;
  qualification: string;
  requiredSkills: string[];
  jobResponsibilities: string;
  startDate: Date;
  endDate: Date;
  slot: number;
  requirements: string;
  jobDescription: string;
}

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
    const response = await axios.post(`${COMPANY_URI}/postjob/${companyId}`,data);
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
        console.error("Job posting Error", error.response?.data);
      }
  }
};


export const fetchJob=async (companyId:string)=>{
  try {
    const response= await axios.get(`${COMPANY_URI}/jobs/${companyId}`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job fetching Error", error.response?.data);
    }
  }
}