import { useEffect, useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import profileImage from "../../assets/person_1.jpg"; 
import { fetchCompany, getApplicants } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useParams, useNavigate } from "react-router-dom";
import { Application } from "../../types/types";

const CopmanyApplicants = () => {
  const [selected, setSelected] = useState <string|undefined>("Applicants");
  const [heading, setHeading] = useState("Applicants");
  const [details, setDetails] = useState<Application[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";
  const { jobId } = useParams<{ jobId: string }>(); 
  const [companyId, setCompanyId] = useState<string | undefined>(undefined);
  const navigate = useNavigate(); 
      useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const response = await fetchCompany(userId);
        if (response.company?.company) {
          setCompanyId(response.company.company._id);
        }
      } catch (err) {
        const error =err as Error
        console.error("Error fetching company:", error.message);
      }
    };
    fetchCompanyId();
  }, [userId]);

  const fetchApplicants = async (companyId:string) => {
    console.log("e",jobId, companyId)
    if (!jobId || !companyId) {
      console.log("eo",jobId, companyId)
      setError("Missing job ID or company ID");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getApplicants(jobId, companyId);
      setDetails(response.applications);
      setHeading(`Applicants for ${response.applications[0]?.jobId.jobTitle || "Job"}`); 
    } catch (err: any) {
      const error =err as Error
      console.log("Error in fetching applicants:", error);
      setError(error.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchApplicants(companyId);
    }
  }, [jobId, companyId]);

  const handleViewApplication = (applicationId: string) => {
    navigate(`/company/applicants/${applicationId}`, { state: { companyId } });
  };

  if (loading) {
    return (
      <div className="flex">
        <CompanySidebar setSelected={setSelected} />
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
        <CompanySidebar setSelected={setSelected} />
        <div className="bg-[#F6F6F6] w-full p-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <ComapanyHeader heading={heading} />
          <div className="text-center text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelected} />
      <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <ComapanyHeader heading={heading} />
        <div className="w-full p-5">
          {/* Header Row */}
          <div className="grid grid-cols-6 items-center font-medium bg-gray-100 p-3 rounded-md">
            <p className="text-center"></p>
            <p className="text-center">Full Name</p>
            <p className="text-center">Job Role</p>
            <p className="text-center">Hiring Status</p>
            <p className="text-center">Applied Date</p>
            <p className="text-center"></p>
          </div>
          <hr className="border-gray-600 my-3" />

          {details.length > 0 ? (
            details.map((detail, index) => (
              <div
                key={detail._id || index} 
                className="grid grid-cols-6 items-center bg-white shadow-lg p-4 rounded-md my-2"
              >
                <div className="flex justify-center">
                  <img
                    src={detail.userId.profileImage || profileImage} 
                    alt={`${detail.userId.firstName} ${detail.userId.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = profileImage)} 
                  />
                </div>
                <h1 className="text-center">
                  {detail.userId.firstName} {detail.userId.lastName}
                </h1>
                <h1 className="text-center">{detail.jobId.jobTitle}</h1>
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
            <p className="text-center text-gray-600">No applicants found for this job.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CopmanyApplicants;