import { useEffect, useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchCompany } from "../../services/company/compayJob";
import { getMeetings } from "../../services/company/companyMeeting";
import { useNavigate } from "react-router-dom";
import ToastError from "../../components/Tost/ErrorToast";
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
  const [heading, setHeading] = useState("Scheduled Meetings")
  const [companyId, setCompanyId] = useState("")
  const [meetings, setMeetings] = useState<IMeetingsDetails[] | null>()
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id


  useEffect(() => {
    if (!userId) return
    const getComapny = async () => {
      try {
        const response = await fetchCompany(userId || "")
        setCompanyId(response?.company?.company?._id)
      } catch (error) {

        console.log("Error fetching the company details. Please try again later")
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
      } catch (error) {
        console.log("Error fetching the scheduled meeting. Please try again later")
        setError("Error fetching the scheduled meeting. Please try again later")
      }
    }
    fetchSheduledMeeting()

  }, [companyId])

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

  return (
    <div className="flex">
      <CompanySidebar setSelected={setSelectedMenu} />
      <div
        className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        <ComapanyHeader heading={heading} />
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
                meetings.map((meeting, index) => (
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
      </div>
    </div>
  )
}

export default CompanyScheduledMeeting