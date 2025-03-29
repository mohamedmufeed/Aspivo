import { useEffect, useState } from "react"
import Sidebar from "../../components/Admin/Sidebar"
import { IoChevronBackOutline } from "react-icons/io5";
import profile from "../../assets/person_1.jpg"
import { EllipsisVertical } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchUsers } from "../../services/adminService";
import { useLocation } from "react-router-dom";
import { blockUser } from "../../services/adminService";
import profileAvathar from "../../assets/user.png"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/authSlice";
type User = {
  _id: string;
  userName: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  isBlocked: boolean;
};



const UserManageMent = () => {
  const location = useLocation()
  const [selected, setSelectedMenu] = useState("Users")
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const userPerPage = 5
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetchUsers()
        setUsers(response.users)
        console.log(response.users)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
    fetchUsersData();
  }, [location])


  const indexofLastuser = currentPage * userPerPage
  const indexOfFirstUser = indexofLastuser - userPerPage
  const currentUsers = users.slice(indexOfFirstUser, indexofLastuser)


  const handleBlockUser = async (userId: string) => {
    try {
      const response = await blockUser(userId);

      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
        dispatch(logout());
      } else {
        console.error("Failed to block/unblock user:", response.message);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
    }
  };


  return (
    <div className="flex" >
      <Sidebar setSelected={setSelectedMenu} />
      <div className="bg-[#F6F6F6] w-full  overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>


        <div className="flex justify-between   space-x-10 ">
          <div className="flex mt-10 ">
            <IoChevronBackOutline className="w-8 h-8  ml-3 mr-6" />
            <h1 className="text-3xl font-medium  -mt-0"> Users</h1>
          </div>

          <div className="flex p-3  mt-5 px-15">

            <div className="cursor-pointer font-medium hover:text-orange-600 mr-15 mt-4 ">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36">
                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75" />
                <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
              </svg>
            </div>


            <div className="bg-orange-600 w-13 border-orange-600 border-3 rounded-full" >
              <img className="w-12 h-12  p-1  bg-white rounded-full" src={profile} alt="" />
            </div>

          </div>
        </div>
        <hr className="border border-gray-700" />


        <div className="w-full p-5">
          {/* Header Row */}
          <div className="grid grid-cols-6 items-center font-medium bg-gray-100 p-3 rounded-md">
            <p className="text-center">Profile Image</p>
            <p className="text-center">Full Name</p>
            <p className="text-center">Email</p>
            <p className="text-center">Created At</p>
            <p className="text-center">Block/Unblock</p>
            <p className="text-center">More</p>
          </div>
          <hr className="border-gray-600 my-3" />

          {currentUsers.map((user, index) => (
            <div
              key={index}
              className="grid grid-cols-6  items-center bg-white shadow-lg p-4 rounded-md my-2"
            >
              <div className="flex justify-center">
                <img
                  src={user.profileImage ? user.profileImage : profileAvathar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <h1 className="text-center">{user.userName}</h1>
              <h1 className="text-center text-sm">{user.email}</h1>
              <h1 className="text-center">{new Date(user.createdAt).toLocaleDateString()}</h1>
              <div className="flex justify-center space-x-4">
                <button className="bg-orange-600 p-2 px-4 text-white rounded-lg" onClick={() => handleBlockUser(user._id)} >
                  {user.isBlocked ? "Unblock" : "Block"}
                </button>
              </div>
              <EllipsisVertical className="cursor-pointer ml-20" />
            </div>
          ))}


        </div>







        <hr className="border border-gray-700  relative  top-[200px] " />

        <div className="flex  items-center relative top-[185px] pl-32 left-[820px] space-x-4 mt-8">

          <button className="p-3  rounded-md hover:bg-gray-200" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft size={18} />
          </button>
          {Array.from({ length: Math.ceil(users.length / userPerPage) }, (_, page) => (
            <button
              key={page}
              className={`p-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold ${currentPage === page + 1 ? "bg-orange-600 text-white" : "bg-gray-200"
                }`}
              onClick={() => setCurrentPage(page + 1)}
            >
              {page + 1}
            </button>
          ))}





          <button className="p-3  rounded-md hover:bg-gray-200" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(users.length / userPerPage)))} disabled={currentPage === Math.ceil(users.length / userPerPage)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>



    </div>
  )
}

export default UserManageMent