import axios, { AxiosError } from "axios";
import { ApplicationStatus, JobData } from "../../types/types";
import api from "../api";


export const fetchCompany = async (userId: string) => {
  try {
    const response = await api.get(`company`, {
      params: {
        id: userId
      }
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Comapny fething Error", error.response?.data);
    }
  }
};

export const postJob = async (companyId: string, data: JobData) => {
  try {
    const response = await api.post(
      `company/jobs/${companyId}`,
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
    const response = await api.get(`company/jobs/${companyId}`)
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job fetching Error", error.response?.data);
    }
  }
};

export const editJob = async (jobId: string, data: JobData) => {
  try {
    const respone = await axios.put(`company/jobs/${jobId}/edit`, data);
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job editing Error", error.response?.data);
    }
  }
};

export const deleteJob = async (jobId: string) => {
  try {
    const respone = await api.delete(`company/jobs/${jobId}/delete`);
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job deleting Error", error.response?.data);
    }
  }
};

export const getApplicants = async (jobId: string, companyId: string) => {
  try {
    const respone = await api.get(`company/jobs/${jobId}/applicants`, {
      params: { companyId },
    });
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Applicants fetching Error", error.response?.data);
    }
  }
};

export const getApplicantDetials = async (applicantId: string) => {
  try {
    const respone = await api.get(
      `company/jobs/applicants/${applicantId}/details`
    );
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Applicants details fetching Error", error.response?.data);
    }
  }
};

export const updateStatus = async ( applicantId: string,status: ApplicationStatus) => {
  try {
    const data={status}
    const response=await api.patch(`company/jobs/applicants/${applicantId}/status`,data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Updating status error", error.response?.data);
    }
  }
};
