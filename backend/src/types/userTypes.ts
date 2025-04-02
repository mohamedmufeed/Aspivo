import { ObjectId } from "mongodb";
export interface ProfileTypes {
  profileImage: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  location: string;
}
export interface User {
    _id: string;
    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    location: string;
    position: string;
    about: string;
    profileImage: string;
    resume: string;
    skills: string[];
    education: Education[];
    experiences: Experience[];
    createdAt: string;
    updatedAt: string;
    isAdmin: boolean;
    isBlocked: boolean;
    verified: boolean;
    password?: string;
  }

export interface Experience {
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  employmentType: "Full time" | "Part time" | "Remote" | "Intern" | "Contract";
  location: string;
  description: string;
  currentlyWorking: boolean;
}

export interface Education {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate: Date;
  grade: string;
}



export interface SkillItem {
  name: string;
  _id: ObjectId;
  createdAt: Date;
}
export type SkillItemList = SkillItem[];