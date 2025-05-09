import { GoPencil } from "react-icons/go";
import { CgArrowsExchange } from "react-icons/cg";

import React, { useState } from "react";
import { chageStatus } from "../../../services/company/compayJob";
import EditJobModal from "./EditJobModal";
import { HiOutlineUsers } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { JobData } from "../../../types/types";

interface JobListDropDownProp {
  jobId: string;
  setJobs: React.Dispatch<React.SetStateAction<JobData[] | undefined>>;
  job: JobData;
}

const JobListDropDown: React.FC<JobListDropDownProp> = ({ jobId, setJobs, job }) => {
  const items = [
    { icon: <HiOutlineUsers className="w-5 h-5" />, name: "Applicants", action: "Applicants" },
    { icon: <GoPencil className="w-5 h-5" />, name: "Edit", action: "Edit" },
    { icon: <CgArrowsExchange className="w-5 h-5" />, name: "Chage stauts", action: "Change-status" },
  ];
  const [editModal, setEditModal] = useState(false)
  const navigate = useNavigate()
  const handleStatus = async (jobId: string) => {
    try {
     await chageStatus(jobId)
      window.location.reload(); 
    } catch (error) {
      console.log("Error in the deleting job ", error)
    }
  }



  const handleItemClick = (action: string, jobId: string) => {
    if (action === "Change-status") {
      handleStatus(jobId)
    } else if (action === "Edit") {
      setEditModal(true)
    } else if (action === "Applicants") {
      navigate(`/company-applicants/${jobId}`)
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
            onClick={() => handleItemClick(item.action, jobId)}
          >
            <span className="mr-2 text-gray-600">{item.icon}</span>
            <h1 className="font-medium text-sm">{item.name}</h1>
          </div>
        ))}
      </div>
      {editModal && (
        <EditJobModal
          onClose={() => setEditModal(false)}
          job={job}
          setJobs={setJobs}
        />
      )}
    </div>
  );
};

export default JobListDropDown;