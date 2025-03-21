import { IoIosSearch } from "react-icons/io";
import Navbar from "../../components/homecomponts/Navbar";
import { useNavigate } from "react-router-dom";
import { fetchJob } from "../../services/jobService";
import { useEffect, useState } from "react";
import { JobData } from "../../services/company/compayprofile"

const formatSalary = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  } else {
    return `₹${amount}`;
  }
};

const JobLists = () => {
  const navigate = useNavigate();
  const categoryItems = ["Developer", "UI Design", "Product Designer", "Finance", "Sales"];
  const [jobs, setJobs] = useState<JobData[] >([]);
  const [searchWord, setSearchWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 5
  const [loading, setLoading] = useState(false);




  const loadJobs = async () => {
    if (!hasMore || loading) return
    setLoading(true)
    try {
      const response = await fetchJob({ page, limit });
      const newJobs = response.job;
      if (newJobs.length === 0 || newJobs.length < limit) {
        setHasMore(false)
      }
      setJobs((prevJobs) => [...prevJobs, ...newJobs])
      setPage((prevPage) => prevPage + 1)
    } catch (error) {
      console.log("Error in fetching jobs", error);
      setHasMore(false)
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (!jobs) return;

    let result = [...jobs];


    if (searchWord) {
      const lowerSearch = searchWord.toLowerCase();
      result = result.filter((job) =>
        (job.jobTitle?.toLowerCase() || "").includes(lowerSearch) ||
        (job.company?.companyName?.toLowerCase() || "").includes(lowerSearch) ||
        (job.company?.location?.toLowerCase() || "").includes(lowerSearch)
      );
    }


    if (selectedCategory) {
      result = result.filter((job) =>
        (job.category?.toLowerCase() || "").includes(selectedCategory.toLowerCase())
      );
    }

    setFilteredJobs(result);
  }, [searchWord, selectedCategory, jobs]);

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <Navbar />
      <div>
        {/* Search Bar */}
        <div className="flex justify-center mt-10">
          <div className="bg-white shadow-lg w-1/2 rounded-lg p-2 flex items-center">
            <input
              type="text"
              id="search"
              placeholder="Search by job title, company, or location"
              className="text-black w-full p-4 ml-5 outline-none font-extralight"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
            <button className="w-20 h-14 ml-auto mr-1 flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
              <IoIosSearch className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Advanced Search */}
        <div className="flex justify-center gap-6 mt-9">
          {categoryItems.map((item, index) => (
            <div key={index}>
              <button
                className={`bg-white shadow-lg rounded-xl p-3 px-5 font-medium cursor-pointer hover:bg-orange-500 hover:text-white ${selectedCategory === item ? "bg-orange-600 text-white" : ""
                  }`}
                onClick={() => setSelectedCategory(selectedCategory === item ? null : item)}
              >
                {item}
              </button>
            </div>
          ))}
        </div>

        {/* Job Listing */}
        <div className="px-20 mt-10 space-y-6">
          {filteredJobs ? (
            filteredJobs.length > 0 ? (
              filteredJobs.map((job,index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                >
                  <div className="col-span-2 flex justify-center">
                    {job.company?.logo ? (
                      <img
                        src={job.company.logo}
                        alt={`${job.company.companyName || "Company"} logo`}
                        className="w-10 h-10 object-contain"
                        onError={(e) => (e.currentTarget.src = "/default-logo.png")}
                      />
                    ) : (
                      <span className="text-gray-500">No logo</span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <h1 className="font-semibold text-xl">{job.jobTitle || "N/A"}</h1>
                    <p className="text-sm text-gray-700">{job.company?.companyName || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-semibold text-xl">{job.company?.location || "N/A"}</h1>
                    <p className="text-sm text-gray-700">Location</p>
                  </div>
                  <div className="col-span-2">
                    <h1 className="font-semibold text-xl">
                      {job.minimumSalary && job.maximumSalary
                        ? `${formatSalary(job.minimumSalary)} - ${formatSalary(job.maximumSalary)}`
                        : "N/A"}
                    </h1>
                    <p className="text-sm text-gray-700">Yearly</p>
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <span className="text-gray-700">save</span>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700"
                      onClick={() => navigate(`/job-details/${job._id}`)}
                    >
                      More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-700">No jobs found</div>
            )
          ) : (
            <div className="text-center">Loading...</div>
          )}

          {/* Load More Button */}
          {hasMore && filteredJobs.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                onClick={loadJobs}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
        </div>
     
    
    </div>
  );
};

export default JobLists;