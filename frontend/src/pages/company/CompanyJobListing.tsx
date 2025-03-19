import CompanySidebar from "../../components/Company/ComapnySidebar"
import ComapanyHeader from "../../components/Company/ComapanyHeader"
import { EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchJob } from "../../services/company/compayprofile";
import { JobData } from "../../services/company/compayprofile";
const CompanyJobListing = () => {
  const [selected, setSelected] = useState("Job Listing")
  const [heading, setHeading] = useState("All Jobs")
  const company = useSelector((state: RootState) => state.companyauth.company)
  const companyId = company?._id || ""

  const [jobs, setJobs] = useState<JobData[] | undefined>(undefined);

  useEffect(() => {
    const handlefetchJob = async () => {
      try {
        const response = await fetchJob(companyId)
        console.log("the job response", response.jobs)
        setJobs(response.jobs)
      } catch (error) {
        console.log("Error imn fetching Jobs", error)
      }
    }
    handlefetchJob()
  }, [])


  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelected} />
      <div className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}>
        <ComapanyHeader heading={heading} />
        <div>
          <div className="w-full p-5">
            {/* Header Row */}
            <div className="grid grid-cols-7 items-center font-medium bg-gray-100 p-3 rounded-md">
              <p className="text-center">Role</p>
              <p className="text-center">Status</p>
              <p className="text-center">Start date</p>
              <p className="text-center">Due date</p>
              <p className="text-center">Type</p>
              <p className="text-center">Applicants</p>
              <p className="text-center">More</p>
            </div>
            <hr className="border-gray-600 my-3" />
            {jobs ? (
              jobs.map((job, index) => (
                <div
                  key={index}
                  className="grid grid-cols-7 items-center bg-white shadow-lg p-4 rounded-md my-2"
                >
                  <h1 className="text-center">{job.jobTitle || "N/A"}</h1>
                  <h1 className="text-center">{job.status || "N/A"}</h1>
                  <h1 className="text-center text-sm">
                    {job.startDate ? new Date(job.startDate).toLocaleDateString() : "N/A"}
                  </h1>
                  <h1 className="text-center">
                    {job.endDate ? new Date(job.endDate).toLocaleDateString() : "N/A"}
                  </h1>
                  <h1 className="text-center">{job.typesOfEmployment || "N/A"}</h1>
                  <h1 className="text-center">{job.slot || 0}</h1>
                  <div className="flex justify-center">
                    <EllipsisVertical className="cursor-pointer" />
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
  )
}

export default CompanyJobListing