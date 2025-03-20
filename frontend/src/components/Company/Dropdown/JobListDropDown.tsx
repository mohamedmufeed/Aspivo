import { GoPencil } from "react-icons/go";
import { AiOutlineDelete } from "react-icons/ai";
import React, { act } from "react";
import { deleteJob } from "../../../services/company/compayprofile";
import { JobData } from "../../../services/company/compayprofile";

interface JobListDropDownProp {
  jobId: string;
  setJobs: React.Dispatch<React.SetStateAction<JobData[] | undefined>>;
}

const JobListDropDown: React.FC<JobListDropDownProp> = ({ jobId ,setJobs}) => {
  const items = [
    { icon: <GoPencil className="w-5 h-5" />, name: "Edit" , action:"Edit" },
    { icon: <AiOutlineDelete className="w-5 h-5" />, name: "Delete" , action:"Delete"},
  ];

  const handleDelete = async (jobId: string) => {
    try {
      const response = await deleteJob(jobId)
      // setJobs(response.job)
      console.log(response.job)

    } catch (error) {
      console.log("Error in the deleting job ", error)
    }
  }



  const handleItemClick=(action:string,jobId:string)=>{
    if(action==="Delete"){
      handleDelete(jobId)
    }
  }

  
  return (
    <div className="flex justify-end">
      <div
        className="bg-white w-40 rounded-lg shadow-lg overflow-hidden absolute top-6 right-22 z-10"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <h1 className="font-medium text-md px-4 pt-4">More</h1>
        <hr className="mt-4 border-gray-300" />
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center p-4 cursor-pointer hover:bg-gray-100 transition-all duration-200"
            onClick={()=>handleItemClick(item.action,jobId)}
          >
            <span className="mr-2 text-gray-600">{item.icon}</span>
            <h1 className="font-medium text-sm">{item.name}</h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListDropDown;