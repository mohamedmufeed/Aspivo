import { string, z } from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be 10 digits"),
  position: z.string().min(2, "Position is required"),
  location: z.string().min(2, "Location is required"),
});

export const editAboutSchema = z.object({
  about: z
    .string()
    .trim()
    .min(20, "About must be at least 20 characters")
    .refine((value) => value.split(/\s+/).filter(Boolean).length <= 150, {
      message: "About must be at most 150 words",
    }),
});

export const experinceSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    employmentType: z.string().trim().nonempty("EmploymentType is required"),
    company: z.string().trim().min(3, "Company must be at least 3 characters"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required").default(""),
    location: z
      .string()
      .trim()
      .min(3, "Loaction must be at least 3 characters"),
    description: string()
      .trim()
      .min(20, "About must be at least 20 characters"),
    currentlyWorking: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (!data.currentlyWorking && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required if not currently working",
      path: ["endDate"],
    }
  );


   export const educationSchema=z.object({
    school:z.string().min(3,"School must be at least 3 characters"),
    degree:z.string().min(3 , "Degree must be at least 3  characters"),
    fieldOfStudy:z.string().min(3,"Filed of study must be at least 3  characters"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    grade:z.string().nonempty()
   })



   export   const jobSchema = z.object({
    jobTitle: z.string().min(3, "Job title must be at least 3 characters"),
    category: z.string().nonempty("Category is required"),
    typesOfEmployment: z.array(z.string()).nonempty("Select at least one employment type"),
    minimumSalary: z.string().nonempty("Minimum salary is required"),
    maximumSalary: z.string().nonempty("Maximum salary is required"),
    startDate: z.string().nonempty("Start date is required"),
    endDate: z.string().nonempty("End date is required"),
    slot: z
    .string()
    .nonempty("Slot is required") 
    .refine((val) => /^\d+$/.test(val), { message: "Slot must be a number" }) 
    .refine((val) => parseInt(val, 10) >= 0, { message: "Slot cannot be negative" }),
    requiredSkills: z.array(z.string().min(1, "Skill cannot be empty")),
    jobDescription: z.string().min(10, "Job description must be at least 10 characters"),
    qualification: z.string().min(5, "Qualification is required"),
    jobResponsibilities: z.string().min(5, "Job responsibilities are required"),
    requirements: z.string().min(5, "Requirements are required"),
  });


  export const editCompanyProfileSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyUrl: z.string().min(2, "Company Url must be at least 2 characters"),
    industry: z
      .string().nonempty("Industry is required"),
     startDate: z.string().nonempty("Start date is required"),
     employees: z.string().min(1, "Employess is required"),
    location: z.string().min(2, "Location is required"),
  });


  export const comapnyDescriptionSchema = z.object({
    description: z
      .string()
      .trim()
      .min(20, " must be at least 20 characters")
      .refine((value) => value.split(/\s+/).filter(Boolean).length <= 150, {
        message: "description must be at most 150 words",
      }),
  });