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
            <div className="bg-[#F6F6F6] h-screen " style={{ fontFamily: "DM Sans, sans-serif" }}>

                <div className="flex gap-1 mx-15 pt-6">
                    <div className="bg-white   shadow-gray-100 shadow-lg w-3/3 rounded-lg flex text-center items-center">
                        <IoChevronBackOutline className="w-8 h-8  ml-3 mr-6 cursor-pointer" onClick={() => navigate(-1)} />
                        <h1 className="text-3xl font-medium">Notifications</h1>
                    </div>

                    <div className="bg-white shadow-gray-100 shadow-lg w-1/3 rounded-lg p-2 px-2 flex items-center">
                        <input type="text" id="search" placeholder="Search Notifications" className="text-black w-full p-4 ml-5 outline-none font-extralight" />
                        <button className="w-20 p-5  h-14 ml-auto mr-1 flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
                            <IoIosSearch className="w-6 h-12  " />
                        </button>
                    </div>

                </div>

                {notifications?.map((notification, index) => (
                    <div key={index} className="bg-white mx-22 shadow-gray-100 shadow-lg rounded-lg mt-10 flex justify-between">
                        <div className="flex items-center text-center p-5 pl-10 gap-4 ">
                            {/* <FcGoogle className="w-10 h-10" /> */}
                            <div className="pl-10">
                                {notification.message &&  notification.message.startsWith("Your meeting")?(<h1 className="text-black text-xl font-semibold"> {`${notification.message.slice(0,30)}...\n${notification.message.slice(-47)}`}</h1>):<h1 className="text-black text-xl font-semibold"> {notification.message}</h1>}
                                <p className="text-gray-700 text-md font-extralight text-start">    {new Date(notification.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex text-end p-5.5 ">
                            <button className="bg-orange-600 px-4 rounded-lg text-white font-bold cursor-pointer hover:bg-orange-700" onClick={()=>handeUpdate(userId,notification._id)} disabled={notification.isRead}>{notification.isRead ?"Already Read":"Mark as Read"}</button>
                        </div>
                    </div>
                ))}



            </div>
        </div>
    )
}

export default Notifications