import CompanySidebar from "../../components/Company/ComapnySidebar"
import ComapanyHeader from "../../components/Company/ComapanyHeader"
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchCompany, fetchJob } from "../../services/company/compayJob";
import { JobData } from "../../types/types";
import JobListDropDown from "../../components/Company/Modals/JobListDropDown";
const CompanyJobListing = () => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); 
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  const [jobs, setJobs] = useState<JobData[] | undefined>(undefined);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
    useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const response = await fetchCompany(userId);
        if (response.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err) {
        const error=err as Error
        console.error("Error fetching company:", error.message);
      }
    };
    fetchCompanyId();
  }, [userId]);
  useEffect(() => {
    if(!companyId) return
    const handleFetchJob = async () => {
      try {
        const response = await fetchJob(companyId);
        setJobs(response.jobs);
      } catch (error) {
        console.log("Error in fetching Jobs", error); 
      }
    };
    handleFetchJob();
  }, [companyId]);

  const toggleDropdown = (jobId: string) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId); 
  };

  return (
    <div className="flex">
      <CompanySidebar/>
      <div
        className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <ComapanyHeader heading="All Jobs" />
        <div>
          <div className="w-full p-5">
            {/* Header Row */}
            <div className="grid grid-cols-7 items-center font-medium bg-gray-100 p-3 rounded-md">
              <p className="text-center">Role</p>
              <p className="text-center">Status</p>
              <p className="text-center">Start date</p>
              <p className="text-center">Due date</p>
              <p className="text-center">Type</p>
              <p className="text-center">Status</p>
              <p className="text-center">More</p>
            </div>
            <hr className="border-gray-600 my-3" />
            {jobs ? (
              jobs.map((job, index) => (
                <div
                  key={job._id || index} 
                  className="grid grid-cols-7 items-center bg-white shadow-lg p-4 rounded-md my-2"
                >
                  <h1 className="text-center">{job.jobTitle || "N/A"}</h1>
                  <h1 className="text-center">{"N/A"}</h1> 
                  <h1 className="text-center text-sm">
                    {job.startDate ? new Date(job.startDate).toLocaleDateString() : "N/A"}
                  </h1>
                  <h1 className="text-center">
                    {job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}
                  </h1>
                  <h1 className="text-center">{job.typesOfEmployment || "N/A"}</h1>
                  <h1 className="text-center">{job.isActive ?"Active":"Inactive"}</h1>
                  <div className="flex justify-center relative">
                    <EllipsisVertical
                      className="cursor-pointer"
                      onClick={() => toggleDropdown(job._id || index.toString())}
                    />
                    {openDropdownId === (job._id || index.toString()) && (
                      <JobListDropDown jobId={job._id || index.toString()} setJobs={setJobs}  job={job}/>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Loading jobs...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyJobListing;