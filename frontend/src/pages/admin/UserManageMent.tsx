import { useEffect, useState } from "react"
import Sidebar from "../../components/Admin/Sidebar"
import { EllipsisVertical } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchUsers } from "../../services/adminService";
import { useLocation } from "react-router-dom";
import { blockUser } from "../../services/adminService";
import profileAvathar from "../../assets/user.png"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { logout } from "../../redux/slice/authSlice";
import AdminHeader from "../../components/Admin/AdminHeader";
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


  const handleBlockUser = async (userId: string, isCurrentlyBlocked: boolean) => {
    try {
      const response = await blockUser(userId);

      if (response.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlocked: !user.isBlocked } : user
          )
        );
        if (!isCurrentlyBlocked) {
          console.log(`User ${userId} has been logged out due to blocking.`);
        }
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

        <AdminHeader heading="Users" />

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
                <button className="bg-orange-600 p-2 px-4 text-white rounded-lg" onClick={() => handleBlockUser(user._id, user.isBlocked)} >
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