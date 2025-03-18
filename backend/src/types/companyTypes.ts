import mongoose from "mongoose";
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
    company: string;
  }
  