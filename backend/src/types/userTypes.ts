
 
export  interface ProfileTypes{
profileImage:string;
firstName:string;
lastName:string;
phoneNumber:string;
currentPostion:string;
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
