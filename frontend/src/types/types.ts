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