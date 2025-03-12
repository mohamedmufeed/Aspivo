
 
export  interface ProfileTypes{
profileImage:string;
firstName:string;
lastName:string;
phoneNumber:string;
position:string;
location:string

}


export interface Experience{
    title:string;
    company:string;
    startDate:Date;
    endDate:Date;
    employmentType:"Full time"|"Part time"|"Remote"|"Intern"|"Contract";
    location:string;
    description:string;
    currentlyWorking:boolean

}

export interface Education{
    school:string;
    degree:string;
    fieldOfStudy:string;
    startDate:Date;
    endDate:Date;
    grade:string
}