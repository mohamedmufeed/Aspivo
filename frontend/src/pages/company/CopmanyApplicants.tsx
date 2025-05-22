import {  useEffect, useRef, useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import profileImage from "../../assets/person_1.jpg"; 
import { fetchCompany, getApplicants } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useParams, useNavigate } from "react-router-dom";
import { Application } from "../../types/types";
import SearchBar from "../../components/Admin/SearchBar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import _ from "lodash";

const CopmanyApplicants = () => {
  const [heading, setHeading] = useState("Applicants");
  const [details, setDetails] = useState<Application[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [, setTotalApplicants] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  const { jobId } = useParams<{ jobId: string }>(); 
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const navigate = useNavigate(); 
  const prevRequestRef = useRef<AbortController | null>(null);
  const applicantsPerPage = 6;

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const response = await fetchCompany(userId);
        if (response.company?.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err) {
        const error = err as Error;
        console.error("Error fetching company:", error.message);
      }
    };
    fetchCompanyId();
  }, [userId]);

  const fetchApplicants = async (companyId: string, page = 1, query = "") => {
    if (!jobId || !companyId) {
      setError("Missing job ID or company ID");
      setLoading(false);
      return;
    }

    if (prevRequestRef.current) {
      prevRequestRef.current.abort();
    }
    
    const abortController = new AbortController();
    prevRequestRef.current = abortController;

    try {
      setLoading(true);
      setError(null);
      
      const response = await getApplicants(jobId, companyId, page, applicantsPerPage, query, abortController.signal);
      
      if (prevRequestRef.current === abortController) {
        setDetails(response.applications || []);
        setTotalApplicants(response.totalApplicants || 0);
        setTotalPages(response.totalPages || 1);
        if (response.applications && response.applications.length > 0) {
          setHeading(`Applicants for ${response.applications[0]?.jobId.jobTitle || "Job"}`);
        }
      }
    } catch (err) {
      if (!(err instanceof DOMException && (err as DOMException).name === 'AbortError')) {
        const error = err as Error;
        console.log("Error in fetching applicants:", error);
        if (prevRequestRef.current === abortController) {
          setError(error.message || "Failed to load applicants");
        }
      }
    } finally {
      if (prevRequestRef.current === abortController) {
        setLoading(false);
      }
    }
  };

  const debouncedFetchRef = useRef(
    _.debounce((companyId: string, page: number, query: string) => {
      fetchApplicants(companyId, page, query);
    }, 300)
  );


  useEffect(() => {
    debouncedFetchRef.current = _.debounce((companyId: string, page: number, query: string) => {
      fetchApplicants(companyId, page, query);
    }, 300);
  }, [jobId]);

  useEffect(() => {
    if (companyId) {
      fetchApplicants(companyId, 1, "");
    }
  }, [companyId, jobId]);

  useEffect(() => {
    if (companyId && !searchQuery && currentPage > 1) {
      fetchApplicants(companyId, currentPage, "");
    }
  }, [currentPage]);

 
  useEffect(() => {
    if (companyId && searchQuery) {
      debouncedFetchRef.current(companyId, currentPage, searchQuery);
    }
    
    return () => {
      debouncedFetchRef.current.cancel();
    };
  }, [searchQuery, currentPage, companyId]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const handleViewApplication = (applicationId: string) => {
    navigate(`/company/applicants/${applicationId}`, { state: { companyId } });
  };

  if (loading) {
    return (
      <div className="flex">
        <CompanySidebar />
        <div className="bg-[#F6F6F6] w-full p-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <ComapanyHeader heading={heading} />
          <div className="text-center text-gray-600">Loading applicants...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <CompanySidebar />
        <div className="bg-[#F6F6F6] w-full p-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <ComapanyHeader heading={heading} />
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  console.log("the details", details);
  
  return (
    <div className="flex">
      <CompanySidebar />
      <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <ComapanyHeader heading={heading} />
        <SearchBar placeholder="Search Applicants..." onSearch={handleSearch} />
        <div className="w-full p-5">
          {/* Header Row */}
          <div className="grid grid-cols-6 items-center font-medium bg-gray-100 p-3 rounded-md">
            <p className="text-center">Profile Image</p>
            <p className="text-center">Full Name</p>
            <p className="text-center">Job Role</p>
            <p className="text-center">Hiring Status</p>
            <p className="text-center">Applied Date</p>
            <p className="text-center">Action</p>
          </div>
          <hr className="border-gray-600 my-3" />

          {loading ? (
            <p className="text-center text-gray-500 mt-5">Loading...</p>
          ) : details.length > 0 ? (
            details.map((detail, index) => (
              <div
                key={detail._id || index} 
                className="grid grid-cols-6 items-center bg-white shadow-lg p-4 rounded-md my-2"
              >
                <div className="flex justify-center">
                  <img
                    src={detail.user.profileImage} 
                    alt={`${detail.user.firstName} ${detail.user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = profileImage)} 
                  />
                </div>
                <h1 className="text-center">
                  {detail.user.firstName} {detail.user.lastName}
                </h1>
                <h1 className="text-center">{detail.job.jobTitle}</h1>
                <h1 className="text-center">{detail.status}</h1>
                <h1 className="text-center">
                  {detail.appliedAt ? new Date(detail.appliedAt).toLocaleDateString() : "N/A"}
                </h1>
                <div className="flex justify-center relative">
                  <button
                    className="bg-orange-600 p-3 font-bold rounded-lg text-white hover:bg-orange-700"
                    onClick={() => handleViewApplication(detail._id)}
                  >
                    View Application
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 mt-5">No applicants found for this job.</p>
          )}
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

export default CopmanyApplicants;