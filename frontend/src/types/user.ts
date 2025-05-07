// src/types/user.ts
export interface Experience {
    _id: string;
    title: string;
    company: string;
    startDate: string;
    endDate: string | null;
    employmentType: "Full time" | "Part time" | "Remote" | "Intern" | "Contract";
    location: string;
    description: string;
    currentlyWorking: boolean;
  }
  
  export interface Education {
    _id: string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
  }
  
  export interface SavedJob {
    jobId: string;
    savedAt: string;
  }
  
  export interface User {
    _id: string;
    userName: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    email: string;
    location?: string;
    position?: string;
    isAdmin: boolean;
    about?: string;
    verified: boolean;
    experiences: Experience[];
    education: Education[];
    skills: string[];
    profileImage: string;
    resume: string;
    isBlocked: boolean;
    googleId?: string;
    chatLimit: number;
    savedJobs: SavedJob[];
    features: {
      unlockAiFeatures: boolean;
      unlimitedChat: boolean;
    };
    createdAt: string;
    updatedAt: string;
  }
  