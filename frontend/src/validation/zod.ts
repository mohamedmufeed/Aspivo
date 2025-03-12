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
    endDate: z.string().nonempty("End date is required"),
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