import React, { useState } from 'react'
import { IoChevronBackOutline } from "react-icons/io5";
import profile from "../../assets/user.png";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store/store';
import { LogOut } from 'lucide-react';
import { logoutUser } from '../../services/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slice/authSlice';

interface HeaderProps {
  heading: string
}

const AdminHeader: React.FC<HeaderProps> = ({ heading }) => {
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id || ""
  const dispatch = useDispatch<AppDispatch>()
  const handleLogout = async () => {
    try {
      const response = await logoutUser(userId)
      if (response) {
        dispatch(logout())
        navigate("/login")
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return (
    <div>
      <div className="flex justify-between   space-x-10 ">
        <div className="flex mt-10 ">
          <IoChevronBackOutline className="w-8 h-8  cursor-pointer ml-3 mr-6" onClick={() => navigate(-1)} />
          <h1 className="text-3xl font-medium  -mt-0"> {heading}</h1>
        </div>

        <div className="flex p-3  gap-10 mt-5 px-15">
          <div className="cursor-pointer font-medium hover:text-orange-600  mt-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 36 36"
            >
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75"
              />
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28"
              />
            </svg>
          </div>

          <div className="bg-orange-600 w-13  border-orange-600 border-3 rounded-full" onClick={() => setProfileOpen(prev => !prev)}>
            <img
              className="w-11.5 h-11.5  p-1  bg-white rounded-full"
              src={profile}
              alt=""
            />
          </div>
        </div>
      </div>
      <hr className="border border-gray-700" />

      {/* Admin profile Drop down */}
      {profileOpen && (
        <div className="relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <div className="absolute right-15   w-60 bg-white rounded-lg  shadow-gray-400 shadow-2xl border border-gray-200 ">
            <div className="flex items-center space-x-3 p-4">
              <div className="border-orange-600 border-3 rounded-full">
                <img className="w-12 h-12 p-1 bg-white rounded-full" src={profile} alt="User" />
              </div>
              <div>
                <h1 className="font-bold text-black text-lg">{user ? user.userName : ""}</h1>
              </div>
            </div>
            <hr className="bg-gray-500 text-gray-500" />


            <div className="p-2">
              <button className="flex items-center space-x-4 w-full p-2 rounded text-red-500 hover:bg-gray-100" onClick={handleLogout} >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}



    </div>

  )
}

export default AdminHeader