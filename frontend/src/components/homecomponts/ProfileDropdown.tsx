
import { UserCircle, Briefcase, LogOut } from "lucide-react";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import profileAvathar from "../../assets/user.png"
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slice/authSlice";
import { logoutUser } from "../../services/auth";
import { MdOutlineAttachMoney } from "react-icons/md";
import React from "react";
export interface IProfileProps{
    setDropDown(value:boolean):void
}
const ProfileDropdown:React.FC<IProfileProps> = ({setDropDown}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector((state: RootState) => state.auth.user)
    const handleLogout = async () => {
        try {
          const response = await logoutUser(user?._id || "");
          if (response) {
            dispatch(logout());
            setDropDown(false)
            localStorage.clear(); 
            sessionStorage.clear(); 
            navigate("/login");
          }
        } catch (error) {
          console.error("Error logout user", error);
        }
      };
      


    return (
        <>
            <div className="relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="absolute right-0   mt-10 w-60 bg-white rounded-lg shadow-lg border border-gray-200">

                    <div className="flex items-center space-x-3 p-4">
                        <div className="border-orange-600 border-3 rounded-full">
                            <img className="w-12 h-12 p-1 bg-white rounded-full" src={user?.profileImage ? user.profileImage : profileAvathar} alt="User" />
                        </div>
                        <div>
                            <h1 className="font-bold text-black text-lg">{user ? user.userName : ""}</h1>
                            <p className="text-gray-500 text-sm">Google</p>
                        </div>
                    </div>
                    <hr className="bg-gray-500 text-gray-500" />


                    <div className="p-2">
                        <button className="flex items-center space-x-4 w-full p-2 rounded hover:bg-gray-100">
                            <UserCircle size={20} />
                            <Link to={"/profile"}>
                            <span>Profile</span></Link>
                        </button>
                        <button className="flex items-center space-x-4 w-full p-2 rounded hover:bg-gray-100 cursor-pointer">

                            <Briefcase size={20} />
                            <Link to={"/myjobs"}>
                                <span>My Jobs</span>
                            </Link>
                        </button>

                        <button className="flex items-center space-x-4 w-full p-2 rounded hover:bg-gray-100 cursor-pointer">
                        
                            <MdOutlineAttachMoney size={20} />
                            <Link to={"/subscription"}>
                            <span>Subscription</span>
                            </Link>
                       
                        </button>


                        <button className="flex items-center space-x-4 w-full p-2 rounded text-red-500 hover:bg-gray-100" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};

export default ProfileDropdown;
