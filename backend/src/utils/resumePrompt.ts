import { IUser } from "../models/user";

 export const generateResumePrompt = (user: IUser): string => {
    const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
    const location = user.location || "N/A";
    const position = user.position || "Job Seeker";
    const phone = user.phoneNumber || "N/A";

    const skills = user.skills.join(', ') || "No listed skills";

    const experienceSection = user.experiences.length > 0
      ? user.experiences.map(exp => {
        return `
    - **${exp.title || 'Role'}**, ${exp.company || 'Company'}  
      ${exp.startDate?.toDateString()} - ${exp.currentlyWorking ? 'Present' : exp.endDate?.toDateString() || 'N/A'}  
      Location: ${exp.location || 'N/A'}  
      Type: ${exp.employmentType || 'N/A'}  
      Description: ${exp.description || 'N/A'}
          `;
      }).join('\n')
      : "No professional experience listed.";

    const educationSection = user.education.length > 0
      ? user.education.map(edu => {
        return `
    - **${edu.degree || 'Degree'}**, ${edu.school || 'School'} (${edu.startDate?.getFullYear()} - ${edu.endDate?.getFullYear()})
      Field of Study: ${edu.fieldOfStudy || 'N/A'}  
      Grade: ${edu.grade || 'N/A'}
          `;
      }).join('\n')
      : "No education details provided.";

    const aboutSection = user.about || "Write a professional summary based on the above information.";

    return `
    You are an expert resume writer. ONLY generate the final resume based on the provided information. 
DO NOT provide suggestions, notes, improvements, or any extra text.
The output must directly start with the resume content. Use clean plain text formatting with clear section headers.
    
    Here is the user's profile:
    
    Full Name: ${fullName}
    Email: ${user.email}
    Phone: ${phone}
    Location: ${location}
    Position: ${position}
    
    Professional Summary:
    ${aboutSection}
    
    Skills:
    ${skills}
    
    Work Experience:
    ${experienceSection}
    
    Education:
    ${educationSection}
    
    Format it as a professional resume with clear section headers (like "Summary", "Experience", "Skills", "Education"). Make sure the output is ATS-friendly (plain text, no columns or fancy formatting).
    `;
  };