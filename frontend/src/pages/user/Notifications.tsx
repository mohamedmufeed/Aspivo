import { IoIosSearch } from "react-icons/io"
import Navbar from "../../components/homecomponts/Navbar.js"
import { IoChevronBackOutline } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store.js";
import { useEffect, useState } from "react";
import { getNotifications, updateNotification } from "../../services/notificationService.js";

interface Notification {
    _id: string;
    userId: string;
    isRead:boolean;
    message: string;
    createdAt: string;
}


const Notifications = () => {
    const navigate = useNavigate()
    const [notifications, setNotifications] = useState<Notification[]>()
    const user = useSelector((state: RootState) => state.auth.user)
    const userId=user?._id||""


    useEffect(() => {
        const handleNotifications = async () => {
            try {
                const response = await getNotifications(userId || "")
                setNotifications(response)
            } catch (error) {
                console.log("the error ", error)
            }
        }
        handleNotifications()
    }, [userId])


    const handeUpdate = async (userId: string, notificationId: string) => {
        try {
            const response = await updateNotification(userId, notificationId)
            setNotifications(response.updatedNotification)
        } catch (error) {
            console.log("Error updating notification", error)
        }
    }

    return (
        <div>
        <Navbar />
        <div
          className="bg-[#F6F6F6] min-h-screen pb-10 px-4 sm:px-18"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
        
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
   
            <div className="bg-white shadow-lg w-full sm:w-2/3 rounded-lg flex items-center px-4 py-3">
              <IoChevronBackOutline
                className="w-5 h-5 sm:w-7 sm:h-7 mr-4 cursor-pointer"
                onClick={() => navigate(-1)}
              />
              <h1 className="text-xl sm:text-3xl font-medium">Notifications</h1>
            </div>
      
     
            <div className="bg-white shadow-lg w-full sm:w-1/3 rounded-lg flex items-center px-2 py-2 sm:py-3">
              <input
                type="text"
                id="search"
                placeholder="Search Notifications"
                className="text-black w-full p-3 text-sm sm:text-base outline-none"
              />
              <button className="p-4  bg-orange-600 hover:bg-orange-700 text-white rounded-md ml-2">
                <IoIosSearch className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
      
          {/* Notification Cards */}
          {notifications?.map((notification, index) => (
            <div className="px-0 sm:px-10">
            <div
              key={index}
              className="bg-white shadow-lg  px-3 rounded-lg mt-6 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                {/* Notification Text */}
                <div className="flex-1">
                  <h1 className="text-black text-sm sm:text-lg md:text-lg font-semibold">
                    {notification.message && notification.message.startsWith("Your meeting")
                      ? `${notification.message.slice(0, 30)}...\n${notification.message.slice(-47)}`
                      : notification.message}
                  </h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
      
              {/* Button */}
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => handeUpdate(userId, notification._id)}
                  disabled={notification.isRead}
                  className={`w-full sm:w-auto bg-orange-600 hover:bg-orange-700 font-bold text-white text-sm sm:text-base px-4 py-2 rounded-md transition-all duration-200 ${
                    notification.isRead ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {notification.isRead ? "Already Read" : "Mark as Read"}
                </button>
              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
      
    )
}

export default Notifications