import { useEffect, useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchCompany } from "../../services/company/compayJob";
import { getMeetings } from "../../services/company/companyMeeting";
import { useNavigate } from "react-router-dom";
import ToastError from "../../components/Tost/ErrorToast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface targetId {
  _id: string,
  profileImage: string;
  firstName: string;
  lastName: string;
  email: string
}

interface IMeetingsDetails {
  _id?: string
  roomId: string;
  peerId: string;
  startTime: string;
  initiatorId: string;
  targetId: targetId;
  link: string;
}


const CompanyScheduledMeeting = () => {
  const [selected, setSelectedMenu] = useState<string | undefined>("Scheduled Meetings");
  const [companyId, setCompanyId] = useState("")
  const [meetings, setMeetings] = useState<IMeetingsDetails[] | null>()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id


  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!userId) return
    const getComapny = async () => {
      try {
        const response = await fetchCompany(userId || "")
        setCompanyId(response?.company?.company?._id)
      } catch (error) {
        console.log("Error fetching the company details. Please try again later", error)
        setError("Error fetching the company details. Please try again later")
      }
    }
    getComapny()
  }, [userId])


  useEffect(() => {
    if (!companyId) return
    const fetchSheduledMeeting = async () => {
      try {
        const response = await getMeetings(companyId)
        setMeetings(response.meeting)
        
   
        if (response.meeting) {
          setTotalPages(Math.ceil(response.meeting.length / itemsPerPage));
        }
      } catch (error) {
        console.log("Error fetching the scheduled meeting. Please try again later", error)
        setError("Error fetching the scheduled meeting. Please try again later")
      }
    }
    fetchSheduledMeeting()

  }, [companyId, itemsPerPage])

  const handleVideoCall = (meeting: IMeetingsDetails) => {
    if (!meeting) return
    const now = new Date();
    const meetingTime = new Date(meeting.startTime);
    if (now < meetingTime) {
      setError("The meeting has not started yet. Please wait until the scheduled time.")
      return
    }
    const companyPeerId = `company-${companyId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    navigate("/company-video", {
      state: {
        roomId: meeting.roomId,
        myPeerId: companyPeerId,
        targetPeerId: meeting.peerId
      },
      replace: true
    });
  }

  
  const getCurrentMeetings = () => {
    if (!meetings) return [];
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return meetings.slice(indexOfFirstItem, indexOfLastItem);
  };


  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const getPaginationNumbers = () => {
    const pages = [];
    const maxPageNumbersToShow = 5;
    
    if (totalPages <= maxPageNumbersToShow) {
 
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
    
      let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
      let endPage = startPage + maxPageNumbersToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const currentMeetings = getCurrentMeetings();

  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelectedMenu} />
      <div
        className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <ComapanyHeader heading="Scheduled Meetings" />
        <div className="flex justify-center">
          {error ? <ToastError message={error} onClose={() => setError(null)} /> : ""}
        </div>

        <div>
          <div className="w-full p-5">
            {/* Header Row */}
            <div className="grid grid-cols-5 items-center font-medium bg-gray-100 p-3 rounded-md">
              <p className="text-center">Image</p>
              <p className="text-center">Name</p>
              <p className="text-center">Email</p>
              <p className="text-center">Start date</p>
              <p className="text-center">Action</p>
            </div>

            <hr className="border-gray-600 my-3" />
            {meetings ? (
              meetings.length > 0 ? (
                currentMeetings.map((meeting, index) => (
                  <div
                    key={meeting._id || index}
                    className="grid grid-cols-5 items-center bg-white shadow-lg p-4 rounded-md my-2"
                  >
                    <div className="text-center px-20">
                      <img
                        src={meeting.targetId.profileImage}
                        alt="Image"
                        className="w-9 h-9 rounded-full"
                      />
                    </div>
                    <h1 className="text-center">
                      {meeting.targetId.firstName} {meeting.targetId.lastName}
                    </h1>
                    <h1 className="text-center text-sm">{meeting.targetId.email}</h1>
                    <h1 className="text-center">
                      {new Date(meeting.startTime).toLocaleString()}
                    </h1>
                    <div className="flex justify-center relative">
                      <button
                        className="bg-orange-600 text-white font-bold p-3 rounded-lg cursor-pointer"
                        onClick={() => handleVideoCall(meeting)}
                      >
                        Start Call
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 mt-4">No meetings scheduled.</p>
              )
            ) : (
              <p className="text-center text-gray-500 mt-4">Loading meetings...</p>
            )}

          </div>
        </div>
        
        {/* Pagination controls */}
        {meetings && meetings.length > 0 && (
          <div className="flex justify-center items-center gap-2 my-4 pb-6">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`flex items-center justify-center bg-gray-200 rounded-lg w-8 h-8 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'}`}
            >
              <ChevronLeft size={18} />
            </button>
            
            {getPaginationNumbers().map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  currentPage === number
                    ? 'bg-orange-600 text-white font-bold'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`flex items-center justify-center bg-gray-200 rounded-lg w-8 h-8 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-300'}`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompanyScheduledMeeting