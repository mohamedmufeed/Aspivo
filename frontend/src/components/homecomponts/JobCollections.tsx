
import { IoIosArrowRoundForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { latestJobs } from "../../services/jobService";
import { useEffect, useState } from "react";
import { JobData } from "../../types/types";



const JobCollections = () => {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<JobData[]>([])

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        const response = await latestJobs()
        setJobs(response.jobs)
      } catch (error) {
        console.error("Error on fetching latest jobs",error);

      }
    }
    fetchLatestJobs()
  }, [])


  const handleJobApply = (jobId: string|undefined) => {
    navigate(`/job-details/${jobId}`);
  };
  return (
    <div className="bg-[#F6F6F6] w-full sm:w-auto" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="sm:pt-10">
        <h1 className=" sm:pt-10 sm:text-3xl text-2xl font-semibold text-center">Latest Job Circulars</h1>
        <div className="flex justify-end px-10 p-6 sm:p-0 md:p-0  sm:px-23 md:px-23 sm:pt-0 md:pt-0 cursor-pointer" onClick={() => navigate("/jobs")}>
          <h1>View all </h1>
          <IoIosArrowRoundForward className="w-6 h-6" />
        </div>
        <div className=" grid grid-cols-12 space-x-4  px-6 sm:px-20 sm:pt-10 gap-5 ">
          {/* card */}
          {jobs && jobs.length > 0 ? (
            jobs.map((job) => (
              <div key={job._id} className="bg-white shadow-xl rounded-xl col-span-12 md:col-span-4 h-auto  mb-6  transform transition-all hover:shadow-2xl  hover:scale-105">
                <div className="p-8">
                  <div className="flex space-x-3 ">
                    <img      src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${job.company.logo}`} alt="logo" className="w-13 h-13 rounded-lg"  />
                    {/* <FcGoogle className="w-13 h-13" /> */}
                    <div className="">
                      <h1 className="font-semibold text-xl">{job.company.companyName}</h1>
                      <p className="text-gray-500 text-sm">{job.company.location}</p>
                    </div>
                  </div>
                  <div >
                    <h1 className="font-medium text-3xl pt-8">{job.jobTitle} </h1>
                    <p className="text-md text-gray-500 pl-1">{job.typesOfEmployment}</p>
                  </div>
                  <p className="text-md  pt-6 text-gray-700">
                    You will be executed to lead the company 's entire stratagy
                  </p>
                  <div className="flex pt-10  justify-between">
                    <div className="flex items-center">
                      <h1 className="font-semibold text-3xl sm:text-2xl ">{job.maximumSalary}₹</h1>
                      <p className="text-sm text-gray-500">/year</p>
                    </div>
                    <button className="bg-orange-600 text-white font-bold p-3 rounded-lg cursor-pointer hover:bg-orange-700" onClick={()=>handleJobApply(job._id)}>Apply Now</button>
                  </div>
                </div>

              </div>
            ))

          ) :
            (<p> NO jobs found</p>)}

        </div>
      </div>

    </div>
  )
}

export default JobCollections