import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../../components/homecomponts/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { appliedJobs, populatedJobs } from "../../services/jobService";
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  status: string;
  logo: string;
}

const MyJobs = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"Saved Jobs" | "Applied Jobs">("Saved Jobs");
  const [savedJob, setSavedJob] = useState<Job[]>([]);
  const [appliedJob, setAppliedJob] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";

  const jobs = activeTab === "Saved Jobs" ? savedJob : appliedJob;

  const handleConnect = (jobId: string) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleAppliedJobs = async () => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await appliedJobs(userId);
      console.log("the applies",response)
      
      if (response) {
        const mappedJobs = response?.applications.map((app:any) => ({
          id: app.jobId._id,
          title: app.jobId.jobTitle,
          company: app.jobId.company.companyName,
          location: app.jobId.company.location,
          salaryRange: `$${app.jobId.minimumSalary / 1000}k - $${app.jobId.maximumSalary / 1000}k`,
          status: app.status,
          logo: app.jobId.company.logo,
        }));
        setAppliedJob(mappedJobs);
        console.log(mappedJobs)
      }
    } catch (err) {
      const error= err as Error
      console.log("Error in fetching applied jobs", error);
      setError(error.message || "Failed to load applied jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSavedJobs = async () => {
    if (!userId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
       const response = await populatedJobs(userId);
       console.log("the rep",response)
      const mappedJobs = response.savedJobs

      .map((saved: any) => ({
        id: saved.jobId._id,
        title: saved.jobId.jobTitle,
        company: saved.jobId.company.companyName,
        location: saved.jobId.company.location,
        salaryRange: `$${saved.jobId.minimumSalary / 1000}k - $${saved.jobId.maximumSalary / 1000}k`,
        status: "Saved",
        logo: saved.jobId.company.logo,
      }));
      setSavedJob(mappedJobs);
    } catch (error: any) {
      console.log("Error in fetching saved jobs", error);
      setError(error.response?.data?.message || "Failed to load saved jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "Applied Jobs") {
      handleAppliedJobs();
    } else {
       handleSavedJobs();
    }
  }, [activeTab, userId]);

  if (loading) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />
        <div className="mx-12 mt-10">
          <div className="bg-white p-5 shadow-lg rounded-lg flex items-center">
            <IoChevronBackOutline
              className="w-8 h-8 ml-3 mr-6 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-3xl font-medium">My Jobs</h1>
          </div>
          <div className="text-center text-gray-600 p-5">  
          <div className="#bg-[#F6F6F6] flex justify-center items-center h-screen">
                <Bouncy size="45" speed="1.75" color="#FE4F00" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#F6F6F6] min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <Navbar />
        <div className="mx-12 mt-10">
          <div className="bg-white p-5 shadow-lg rounded-lg flex items-center">
            <IoChevronBackOutline
              className="w-8 h-8 ml-3 mr-6 cursor-pointer"
              onClick={() => navigate(-1)}
            />
            <h1 className="text-3xl font-medium">My Jobs</h1>
          </div>
          <div className="text-center text-red-500 p-5">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <Navbar />
      <div className="mx-12 mt-10">
        <div className="bg-white p-5 shadow-lg rounded-lg flex items-center">
          <IoChevronBackOutline
            className="w-8 h-8 ml-3 mr-6 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-3xl font-medium">My Jobs</h1>
        </div>
        <div className="bg-white shadow-lg rounded-lg mt-5">
          <div className="flex space-x-10 px-20 p-5">
            <h1
              className={`cursor-pointer hover:text-orange-600 ${activeTab === "Saved Jobs" ? "text-orange-600 font-semibold" : ""
                }`}
              onClick={() => setActiveTab("Saved Jobs")}
            >
              Saved Jobs
            </h1>
            <h1
              className={`cursor-pointer hover:text-orange-600 ${activeTab === "Applied Jobs" ? "text-orange-600 font-semibold" : ""
                }`}
              onClick={() => setActiveTab("Applied Jobs")}
            >
              Applied Jobs
            </h1>
          </div>
          <hr className="text-gray-300" />
          <div className="p-5">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white shadow-md rounded-xl mx-4 md:mx-10 grid grid-cols-12 items-center p-5 mb-5"
                >
                  <div className="col-span-2">
                    {job.company === "Google .inc" ? (
                      <FcGoogle className="w-9 h-9 ml-5" />
                    ) : (
                      <img
                      src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${job.logo}`}
                        alt={`${job.company} logo`}
                        className="w-9 h-9 rounded-full object-contain ml-5"
                      
                      />
                    )}
                  </div>
                  <div className="col-span-3">
                    <h1 className="font-semibold text-lg">{job.title}</h1>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-semibold text-lg">{job.location || "N/A"}</h1>
                    <p className="text-sm text-gray-500">Location</p>
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-semibold text-lg">{job.salaryRange}</h1>
                    <p className="text-sm text-gray-500">Yearly</p>
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-semibold text-lg">{job.status}</h1>
                    <p className="text-sm text-gray-500">Status</p>
                  </div>
                  <div className="col-span-1">
                    <button
                      className="bg-orange-600 text-white p-3 rounded-lg font-bold cursor-pointer hover:bg-orange-700"
                      onClick={() => handleConnect(job.id)}
                    >
                      Connect
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 p-5">
                No {activeTab.toLowerCase()} found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobs;