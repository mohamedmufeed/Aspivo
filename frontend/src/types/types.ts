interface PopulatedUser {
    _id: string;
    firstName: string;
    lastName: string;
    profileImage: string;
    email: string;
    phone: string;
    skills: string[];
  }
  
  interface PopulatedJob {
    _id: string;
    jobTitle: string;
  }
  
  export interface Application {
    _id: string;
    userId: PopulatedUser;
    jobId: PopulatedJob;
    status: string;
    appliedAt: string;
  }



export type ApplicationStatus = "pending"| "reviewed"| "accepted"| "rejected";

interface Education {
  degree: string;
  school: string;
  startDate: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string;
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
  __v: number;
}

interface Job{
  _id:string;
  jobTitle:string;
  typesOfEmployment:string
}

  export interface JobApplication {
  _id: string;
  jobId: Job;
  userId: User;
  status: ApplicationStatus;
  appliedAt: string;
  __v: number;
}



export interface JobData {
  _id:string|undefined;
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
  company: {
    _id: string;
    companyName: string;
    logo?: string; 
    location?: string; 
    email?:string
  }
}