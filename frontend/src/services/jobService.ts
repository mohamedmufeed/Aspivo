import { AxiosError } from "axios";
import api from "./api";
import { USER_BASE_ROUTE } from "../constants/apiRoutes";

export const fetchJob = async ({
  page,
  limit,
  search,
  category,
}: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
}) => {
  try {
    const params: {
      page: number;
      limit: number;
      search?: string;
      category?: string;
    } = { page, limit };


    if (search) {
      params.search = search;
    }

    if (category) {
      params.category = category;
    }

    const response = await api.get(`${USER_BASE_ROUTE}/jobs`, { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job fetching error:", error.response?.data);
    }
    return {
      job: [],
      total: 0,
      page: 1,
      totalPages: 0,
      message: "Error fetching jobs"
    };
  }
};

export const getJobDetails = async (jobId: string,) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job  details fethcing :", error.response?.data);
    }
  }
};

export const applyForJob = async (jobId: string, userId: string) => {
  try {
    const data = { userId };
    const response = await api.post(`${USER_BASE_ROUTE}/jobs/${jobId}/apply`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("apply job :", error.response?.data);
    }
  }
};

export const appliedJobs = async (userId: string) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/users/${userId}/applied-jobs`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("applied jobs  :", error.response?.data);
    }
  }
};

export const isApplied = async (userId: string, jobId: string) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/jobs/${userId}/is-applied/`, { params: { jobId } });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("applied jobs  :", error.response?.data);
    }
    return
  }
};

export const saveJob = async (userId: string, jobId: string) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/users/${userId}/save-job`,{jobId})
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on saving job  :", error.response?.data);
    }
    return
  }
}


export const savedJobs=async(userId:string)=>{
try {
  const response=await api.get(`${USER_BASE_ROUTE}/users/${userId}/saved-jobs`)
  return response.data

} catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on fetching saved jobs :", error.response?.data);
    }
    return
}
}


export const populatedJobs=async(userId:string)=>{
  try {
    const response= await api.get(`${USER_BASE_ROUTE}/users/${userId}/saved-jobsdata`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on fetching saved job details :", error.response?.data);
    }
    return
  }
}


 export const latestJobs= async()=>{
  try {
    const response=await api.get(`${USER_BASE_ROUTE}/latest-jobs`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on fetching latest job details :", error.response?.data);
    }
    return
  }
 }