import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { EllipsisVertical } from "lucide-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchUsers } from "../../services/adminService";
import { useLocation } from "react-router-dom";
import { blockUser } from "../../services/adminService";
import profileAvathar from "../../assets/user.png";
import AdminHeader from "../../components/Admin/AdminHeader";
import SearchBar from "../../components/Admin/SearchBar";
import _ from "lodash";
import AdminApproveToast from "../../components/Admin/AdminApproveToast";

type User = {
  _id: string;
  userName: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  isBlocked: boolean;
};

const UserManageMent = () => {
  const location = useLocation();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selecetdUserBlockStatus, setselecetdUserBlockStatus] = useState<boolean | undefined>(undefined)
  const [adminApproveToast, setAdminAprroveToast] = useState(false)
  const userPerPage = 5;
  const prevRequestRef = useRef<AbortController | null>(null);


  console.log(selecetdUserBlockStatus)
  const fetchUsersData = async (page = 1, query = "") => {
    if (prevRequestRef.current) {
      prevRequestRef.current.abort();
    }
    const abortController = new AbortController();
    prevRequestRef.current = abortController;

    setIsLoading(true);
    try {
      const response = await fetchUsers(page, userPerPage, query, abortController.signal);
      if (prevRequestRef.current === abortController) {
        setUsers(response.users);
        setTotalPages(response.totalPages);
        setTotalUsers(response.totalUsers);
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        console.error("Error fetching users:", error);
      }
    } finally {
      if (prevRequestRef.current === abortController) {
        setIsLoading(false);
      }
    }
  };
  const debouncedFetch = useCallback(
    _.debounce((page: number, query: string) => {
      fetchUsersData(page, query);
    }, 300),
    [fetchUsersData]
  );

  useEffect(() => {
    if (searchQuery) {
      debouncedFetch(currentPage, searchQuery);
    } else {
      fetchUsersData(currentPage, searchQuery);
    }
  }, [currentPage, location]);


  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (currentPage !== 1) setCurrentPage(1);
    debouncedFetch(1, query);
  };

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
      } else {
        console.error("Failed to block/unblock user:", response.message);
        fetchUsersData(currentPage, searchQuery);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      fetchUsersData(currentPage, searchQuery);
    }
  };
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
      if (prevRequestRef.current) {
        prevRequestRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div
        className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
     
        <AdminHeader heading="Users" />
   <div className="flex justify-center pb-5 transition-all w-full">
          {adminApproveToast ? <AdminApproveToast
            userId={selectedUserId || ""}
            onClose={() => setAdminAprroveToast(false)}
            onConfirmBlock={(userId) => {
              const user = users.find(u => u._id === userId);
              if (user) {
                handleBlockUser(userId, user.isBlocked);
              }
            }}
          />
            : ""}
        </div>

        <SearchBar placeholder="Search users..." onSearch={handleSearch} />
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

          {isLoading && users.length === 0 ? (
            <div className="text-center py-10">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-10">No users found</div>
          ) : (
            <div className="transition-opacity duration-300">
              {users.map((user, index) => (
                <div
                  key={user._id || index}
                  className="grid grid-cols-6 items-center bg-white shadow-lg p-4 rounded-md my-2"
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
                  <h1 className="text-center">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </h1>
                  <div className="flex justify-center space-x-4">
                    <button
                      className={`p-2 px-4 text-white rounded-lg ${isLoading ? "bg-gray-400" : "bg-orange-600 hover:bg-orange-700"
                        }`}

                      // onClick={() => handleBlockUser(user._id, user.isBlocked)}
                      onClick={() => {
                        setAdminAprroveToast(true)
                        setSelectedUserId(user._id)
                        setselecetdUserBlockStatus(user.isBlocked)
                      }}
                      disabled={isLoading}
                    >
                      {user.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                  <EllipsisVertical className="cursor-pointer ml-20" />
                </div>
              ))}
            </div>
          )}

          {isLoading && users.length > 0 && (
            <div className="flex justify-center items-center py-4">
              <div className="text-orange-600">Updating...</div>
            </div>
          )}
        </div>

        {totalUsers > 0 && (
          <div className="flex items-center justify-center mt-8 pb-4">
            <button
              className="p-3 rounded-md  disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft size={18} />
            </button>

            {_.range(1, totalPages + 1).map(page => {
              if (
                totalPages <= 5 ||
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`p-3 w-8 gap-x-6 h-8 rounded-sm flex items-center justify-center font-bold ${currentPage === page
                      ? "bg-orange-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    onClick={() => setCurrentPage(page)}
                    disabled={isLoading}
                  >
                    {page}
                  </button>
                );
              }


              if ((page === 2 && currentPage > 3) || (page === totalPages - 1 && currentPage < totalPages - 2)) {
                return <span key={`ellipsis-${page}`} className="px-2">...</span>;
              }

              return null;
            })}

            <button
              className="p-3 rounded-md 0 disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManageMent;