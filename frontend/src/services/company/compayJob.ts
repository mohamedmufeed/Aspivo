import { AxiosError } from "axios";
import { ApplicationStatus, JobData } from "../../types/types";
import api from "../api";
import { COMPANY_BASE_ROUTE } from "../../constants/apiRoutes";


export const fetchCompany = async (userId: string) => {
  try {
    const response = await api.get(`${COMPANY_BASE_ROUTE}`, {
      params: {
        id: userId
      }
    });
    console.log("response data", response.data)
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
      `${COMPANY_BASE_ROUTE}/jobs/${companyId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job posting Error", error.response?.data);
    }
  }
};

export const fetchJob = async (companyId: string, page = 1, limit = 10, searchQuery = "", signal?: AbortSignal) => {
  try {
    const response = await api.get(`${COMPANY_BASE_ROUTE}/jobs/${companyId}`, {
      params: {
        page,
        limit,
        q: searchQuery
      },
      signal
    })
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job fetching Error", error.response?.data);
    }
  }
};

export const editJob = async (jobId: string, data: JobData) => {
  try {
    const respone = await api.put(`${COMPANY_BASE_ROUTE}/jobs/${jobId}/edit`, data);
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job editing Error", error.response?.data);
    }
  }
};

export const chageStatus = async (jobId: string) => {
  try {
    const respone = await api.patch(`${COMPANY_BASE_ROUTE}/jobs/${jobId}/delete`);
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Job deleting Error", error.response?.data);
    }
  }
};

export const getApplicants = async (jobId: string, companyId: string) => {
  try {
    const respone = await api.get(`${COMPANY_BASE_ROUTE}/jobs/${jobId}/applicants`, {
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
      `${COMPANY_BASE_ROUTE}/jobs/applicants/${applicantId}/details`
    );
    return respone.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Applicants details fetching Error", error.response?.data);
    }
  }
};

export const updateStatus = async (applicantId: string, status: ApplicationStatus) => {
  try {
    const data = { status }
    const response = await api.patch(`${COMPANY_BASE_ROUTE}/jobs/applicants/${applicantId}/status`, data)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Updating status error", error.response?.data);
    }
  }
};
