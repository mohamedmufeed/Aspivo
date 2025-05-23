import  { useEffect, useState, useRef, useCallback } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { ChevronDown, ChevronLeft, ChevronRight, EllipsisVertical } from "lucide-react";
import { getSubcriptions } from "../../services/adminService";
import { updateSubscriptionStatus } from "../../services/adminService";
import AdminHeader from "../../components/Admin/AdminHeader";
import _ from "lodash";
import SearchBar from "../../components/Admin/SearchBar";

interface Subscription {
    _id: string;
    user: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
    companyId: string;
    subscriptionId: string;
    plan: string;
    amount: number;
    status: "active" | "inactive" | "cancelled";
    createdAt: string;
    updatedAt: string;
}

const SubscriptionHandling = () => {
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [currentPage,setCurrentPage]=useState(1)
    const subscriptionPerPage=6
    const [totalPages,setTotalPages]=useState(1)
    const [searchQuery,setSearchQuery]=useState("")
    const [,setTotalSubscription]=useState(0)
    const prevRequestRef = useRef<AbortController | null>(null)
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); 
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

 const fetchSubscriptions = async (page = 1, query = "") => {
        if (prevRequestRef.current) {
            prevRequestRef.current.abort()
        }
        const abortController = new AbortController()
        prevRequestRef.current = abortController
        setLoading(true)
        try {
            const response = await getSubcriptions(page, subscriptionPerPage, query, abortController.signal);
            if (prevRequestRef.current === abortController) {
                setSubscriptions(response.subscription);
                setTotalSubscription(response.totalSubscription
                )
                setTotalPages(response.totalPages)
            }
        } catch (error) {
            if (!(error instanceof DOMException && error.name === 'AbortError')) {
                console.error("Error fetching Companies:", error);
            }
        } finally {
            if (prevRequestRef.current === abortController) {
                setLoading(false);
            }
        }
    }

      const debouncedFetch = useCallback(
        _.debounce((page: number, query: string) => {
            fetchSubscriptions(page, query);
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedFetch(currentPage, searchQuery)
        } else {
            fetchSubscriptions(currentPage, searchQuery)
        }

    }, [currentPage, searchQuery, location])

    const handleSeach = (query: string) => {
        setSearchQuery(query)
        if (currentPage !== 1) setCurrentPage(1)
        debouncedFetch(1, query)
    }



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRefs.current.every(
                    (ref) => ref && !ref.contains(event.target as Node)
                )
            ) {
                setDropdownOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = (subscriptionId: string) => {
        setDropdownOpen(dropdownOpen === subscriptionId ? null : subscriptionId);
    };

    const handleStatusChange = async (subscriptionId: string, newStatus: "active" | "inactive" | "cancelled") => {
        try {
            const response = await updateSubscriptionStatus(subscriptionId, {status:newStatus});
            setSubscriptions((prev) =>
                prev.map((sub) =>
                    sub._id === subscriptionId ? { ...sub, status: newStatus } : sub
                )
            );
     
        } catch (error: any) {
            console.error("Error updating subscription status:", error);
       
        } finally {
            setDropdownOpen(null); 
        }
    };



    return (
        <div className="flex">
            <Sidebar />
            <div
                className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                      <AdminHeader heading="Subscription Management"/>
              <SearchBar placeholder="Search Subscriptions.." onSearch={handleSeach}/>

            

                <div className="w-full p-5">
                    <div className="grid grid-cols-5 items-center font-medium bg-gray-100 p-3 rounded-md">
                        <p className="text-center">Full Name</p>
                        <p className="text-center">Email</p>
                        <p className="text-center">Created At</p>
                        <p className="text-center">Status</p>
                        <p className="text-center">More</p>
                    </div>
                    <hr className="border-gray-600 my-3" />

                    {loading ? (
                        <div className="text-center text-gray-600 p-5">Loading...</div>
                    ) : subscriptions.length === 0 ? (
                        <div className="text-center text-gray-600 p-5">No subscriptions found.</div>
                    ) : (
                        subscriptions.map((subscription, index) => (
                            <div
                                key={subscription._id}
                                className="grid grid-cols-5 items-center bg-white shadow-lg p-4 rounded-md my-2"
                            >
                                <h1 className="text-center">
                                    {subscription.user.firstName} {subscription.user.lastName}
                                </h1>
                                <h1 className="text-center text-sm">{subscription.user.email}</h1>
                                <h1 className="text-center">
                                    {new Date(subscription.createdAt).toLocaleDateString()}
                                </h1>
                                <div className="relative flex justify-center space-x-4">
                                    <button
                                        className="flex justify-center items-center bg-orange-600 p-2 px-4 text-white rounded-lg"
                                        onClick={() => toggleDropdown(subscription._id)}
                                    >
                                        {subscription.status.charAt(0).toUpperCase() +
                                            subscription.status.slice(1)}
                                        <ChevronDown className="ml-2 w-4 h-4" />
                                    </button>
                                    {dropdownOpen === subscription._id && (
                                        <div
                                        ref={(el) => {
                                            dropdownRefs.current[index] = el;
                                        }}
                                            className="absolute top-10 right-0 bg-white shadow-lg rounded-md z-10"
                                        >
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStatusChange(subscription._id, "active")}
                                            >
                                                Active
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStatusChange(subscription._id, "inactive")}
                                            >
                                                Inactive
                                            </button>
                                            {/* <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStatusChange(subscription._id, "cancelled")}
                                            >
                                                Cancelled
                                            </button> */}
                                        </div>
                                    )}
                                </div>
                                <EllipsisVertical className="cursor-pointer mx-auto" />
                            </div>
                        ))
                    )}
                </div>
                <div className="flex items-center justify-center space-x-4 mt-8">
                    <button
                        className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: totalPages }, (_, page) => (
                        <button
                            key={page}
                            className={`p-3 w-8 h-8 rounded-sm flex items-center justify-center font-bold ${
                                currentPage === page + 1 ? "bg-orange-600 text-white" : "bg-gray-200"
                            }`}
                            onClick={() => setCurrentPage(page + 1)}
                        >
                            {page + 1}
                        </button>
                    ))}

                    <button
                        className="p-3 rounded-md hover:bg-gray-200 disabled:opacity-50"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHandling;