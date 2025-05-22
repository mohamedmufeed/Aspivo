import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchCompany, fetchJob } from "../../services/company/compayJob";
import { JobData } from "../../types/types";
import JobListDropDown from "../../components/Company/Modals/JobListDropDown";
import SearchBar from "../../components/Admin/SearchBar";
import _ from "lodash";

const CompanyJobListing = () => {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  const [jobs, setJobs] = useState<JobData[] | undefined>(undefined);
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(false);
  const jobsPerPage = 6;
  const prevRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const response = await fetchCompany(userId);
        if (response.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching company:", error.message);
      }
    };
    fetchCompanyId();
  }, [userId]);

  const fetchJobsWithPagination = async (page = 1, query = "") => {
    if (!companyId) return;
    
    if (prevRequestRef.current) {
      prevRequestRef.current.abort();
    }
    
    const abortController = new AbortController();
    prevRequestRef.current = abortController;
    
    setLoading(true);
    try {
      const response = await fetchJob(companyId, page, jobsPerPage, query, abortController.signal);
      if (prevRequestRef.current === abortController) {
        setJobs(response.jobs);
        setTotalJobs(response.totalJobs || 0);
        setTotalPages(response.totalPages || 1);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error("Error fetching jobs:", error);
      }
    } finally {
      if (prevRequestRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  const debouncedFetch = useCallback(
    _.debounce((page: number, query: string) => {
      fetchJobsWithPagination(page, query);
    }, 300),
    [companyId]
  );

  useEffect(() => {
    if (companyId) {
      if (searchQuery) {
        debouncedFetch(currentPage, searchQuery);
      } else {
        fetchJobsWithPagination(currentPage, searchQuery);
      }
    }
  }, [currentPage, searchQuery, companyId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 1) setCurrentPage(1);
    debouncedFetch(1, query);
  };

  const toggleDropdown = (jobId: string) => {
    setOpenDropdownId(openDropdownId === jobId ? null : jobId);
  };

  return (
    <div className="flex">
      <CompanySidebar />
      <div
        className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <ComapanyHeader heading="All Jobs" />
        <SearchBar placeholder="Search Jobs..." onSearch={handleSearch} />
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
            
            {loading ? (
              <p className="text-center text-gray-500 mt-5">Loading...</p>
            ) : jobs && jobs.length > 0 ? (
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
                  <h1 className="text-center">{job.isActive ? "Active" : "Inactive"}</h1>
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
              <p className="text-center text-gray-500 mt-5">No jobs available.</p>
            )}
          </div>
        </div>
        
        {totalPages > 0 && (
          <div className="flex items-center justify-center space-x-4 mt-8 mb-4">
            <button
              className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, page) => (
              <button
                key={page}
                className={`p-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold ${
                  currentPage === page + 1 ? "bg-orange-600 text-white" : "bg-gray-200"
                }`}
                onClick={() => setCurrentPage(page + 1)}
              >
                {page + 1}
              </button>
            ))}

            <button
              className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobListing;