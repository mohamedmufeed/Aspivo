import api from "./api";
import { AxiosError } from "axios";
import { Experience } from "../components/User/modals/AddExperience";
import { Education } from "../components/User/modals/AddEducation";
import { USER_BASE_ROUTE } from "../constants/apiRoutes";

export const editProfile = async (userId: string, formData: FormData) => {
  try {
    const response = await api.put(`${USER_BASE_ROUTE}/users/${userId}/profile`, formData);
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
    const response = await api.get(`${USER_BASE_ROUTE}/users/${userId}/profile`);
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
    const response = await api.put(`${USER_BASE_ROUTE}/users/${userId}/about`, {
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
    const response = await api.post(`${USER_BASE_ROUTE}/users/${userId}/experience`, data);
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
    const response = await api.put(`${USER_BASE_ROUTE}/users/${userId}/experience`, data);
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
    const response = await api.post(`${USER_BASE_ROUTE}/users/${userId}/education`, data);
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

export const editEducation = async (userId: string, data: Education) => {
  try {
    const response = await api.put(`${USER_BASE_ROUTE}/users/${userId}/education`, data)
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
    const response = await api.post(`${USER_BASE_ROUTE}/users/${userId}/skills`, { skills });
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

export const uploadResume = async (userid: string, data: string) => {
  try {
    const response = await api.post(`${USER_BASE_ROUTE}/users/${userid}/resume`, data)
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

export const deleteResume = async (userId: string) => {
  try {
    const response = await api.delete(`${USER_BASE_ROUTE}/users/${userId}/resume`)
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


export const getSubscriptionHistory = async (userId: string) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/users/${userId}/subscription-history`)
    return response.data

  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Subscription History:", error.response?.data);
    }
  }
}

export const generateResume = async (userId: string) => {
  try {
    const response = await api.get(`${USER_BASE_ROUTE}/users/${userId}/resume/auto-generate`)
    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error on Generating ai resume:", error.response?.data);
    }
  }
}

export  const textFormating=async(text: string, propmtKey: string, userId: string)=>{
    try {
      const response=await api.post(`${USER_BASE_ROUTE}/users/${userId}/text-format`,{text,propmtKey})
      return response.data
    } catch (error) {
      if(error instanceof AxiosError){
        console.error("Error on Text formating", error.response?.data)
      }
    }
}