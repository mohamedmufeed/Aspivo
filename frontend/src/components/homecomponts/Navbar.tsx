import { useEffect, useState } from "react";
import { CiMenuFries } from "react-icons/ci";
import { useSelector,useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/store/store";
import ProfileDropdown from "./ProfileDropdown";
import profileAvathar from "../../assets/user.png"
import { Link } from "react-router-dom";
import { fetchGoogleUser } from "../../services/auth";
import { login } from "../../redux/slice/authSlice";
import { getNotifications } from "../../services/notificationService";




const Navbar = () => {
    const naviagte = useNavigate()
    const [dropdown, setDropDown] = useState(false)
    const dispatch = useDispatch<AppDispatch>()
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {

        const handelGoogleUser = async () => {
            try {
                const response = await fetchGoogleUser()
                if (response) {
                    dispatch(
                        login({
                            _id: response._id,
                            userName: response.userName,
                            profileImage: response.profileImage,
                            email: response.email,
                            isAdmin: response.isAdmin || false,
                            token: response.token,
                            experiences: response.experiences || [],
                        })
                    );
                } else {
                    console.log("Google Auth failed or no data received");
                }

            } catch (error) {
                console.log("error in the fethcing goole user", error)
            }
        }
        handelGoogleUser()
    }, [])

    const user = useSelector((state: RootState) => state.auth.user)
    const userId = user?._id || ""
    
    useEffect(() => {

        const fetchNotification = async () => {
            try {
                const notification = await getNotifications(userId)
                setNotifications(notification)
            } catch (error) {
                console.log("Error inn fetching ", error)
            }
        }
        fetchNotification()

    }, [userId])


    const undreadNotification = notifications?.some((notification) => !notification.isRead)



    const handeleLogginBtn = () => naviagte("/login")

    const navItems = [
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
        { name: "Jobs", path: "/jobs" },
        { name: "Post job", path: "/company-dashboard" },
        {
            name: "Messages",
            path: "/messages",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M8.5 18.396V15.5h-2a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H12l-3.073 3.073a.25.25 0 0 1-.427-.177Z" />
                        <path strokeLinecap="round" d="M8.5 12.5h7m-7-3h7" />
                    </g>
                </svg>
            )
        }
    ];


    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div className="bg-[#F6F6F6] p-4 flex justify-between   items-center z-50" style={{ fontFamily: "DM Sans, sans-serif" }}>

                <div className="text-[30px] ps-8 font-bold flex items-center font-[Montserrat]">
                    <span className="w-9 h-10 md:w-9 md:h-10 bg-orange-600 text-white rounded-lg font-extrabold flex items-center justify-center mr-1">A</span>
                    spivo
                </div>

                <div className=" hidden  items-center md:flex gap-12 mr-7">

                    <div className="flex gap-12">
                        {navItems.map((nav, index) => (
                            <div key={index} className="cursor-pointer font-extralight hover:text-orange-600">
                                <Link to={nav.path}>{nav.icon ? nav.icon : nav.name} </Link>
                            </div>
                        ))}
                    </div>
                    <Link to={"/notifications"}>

                        <div className=" cursor-pointer font-medium hover:text-orange-600 ">

                           
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36">
                                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75" />
                                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
                            </svg>
                            {undreadNotification && (
                                <div className="relative -top-5 -right-2.5 bg-orange-600 w-2 h-2 rounded-full" />
                            )}
                        </div>
                    </Link>
                    {user ? <div className="bg-orange-600 border-orange-600 border-3 rounded-full" onClick={() => dropdown ? setDropDown(false) : setDropDown(true)}>
                        <img className="w-12 h-12  p-1  bg-white rounded-full" src={user?.profileImage ? user.profileImage : profileAvathar} alt="" />

                    </div> :
                        <button onClick={handeleLogginBtn} className="bg-orange-600 text-white rounded-md font-bold w-[120px] h-11 hover:bg-orange-700 transition-all">
                            Login
                        </button>
                    }
                    <div className="max-w-full relative z-30 ">
                        {dropdown ? <ProfileDropdown /> : ""}
                    </div>

                </div>

                <button className="block md:hidden text-orange-600 text-3xl" onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}>
                    <CiMenuFries />
                </button>

            </div>

            {isOpen && (
                <div className="flex flex-col gap-4 items-center py-4 bg-white w-full shadow-md z-30 md:hidden "  style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {navItems.map((nav, index) => (
                        <div key={index} className="cursor-pointer font-extralight hover:text-orange-600">
                            <Link to={nav.path}>  {nav.icon ? nav.icon : nav.name}  </Link>
                          
                        </div>
                    ))}
                    <Link to={"/notifications"}>
                    <div className="cursor-pointer font-medium hover:text-orange-600 ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36">
                            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75" />
                            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
                        </svg>
                    </div></Link>
                    
                    <button onClick={handeleLogginBtn} className="bg-orange-600 text-white rounded-md font-bold px-6 py-2 hover:bg-orange-500 transition-all">
                        Login
                    </button>
                </div>
            )}
        </>
    );
};

export default Navbar;
