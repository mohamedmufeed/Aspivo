import React, { useEffect, useState, useRef } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { IoChevronBackOutline } from "react-icons/io5";
import Profile from "../../assets/person_1.jpg";
import { ChevronDown, EllipsisVertical } from "lucide-react";
import { getSubcriptions } from "../../services/adminService";
import { updateSubscriptionStatus } from "../../services/adminService";

interface Subscription {
    _id: string;
    userId: {
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
    const [selected, setSelectedMenu] = useState("Subscription");
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null); 
    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoading(true);
            try {
                const response = await getSubcriptions();
                console.log(" the repsonse",response.subscription);
                setSubscriptions(response.subscription);
            } catch (error) {
                console.log("Error fetching subscriptions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptions();
    }, []);


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
            <Sidebar setSelected={setSelectedMenu} />
            <div
                className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <IoChevronBackOutline className="w-8 h-8 cursor-pointer" />
                        <h1 className="text-3xl font-medium ml-4">Subscription Management</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <img
                            className="w-12 h-12 rounded-full border-2 border-orange-600"
                            src={Profile}
                            alt="Profile"
                        />
                    </div>
                </div>

                <hr className="border-black border-1.5" />

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
                                    {subscription.userId.firstName} {subscription.userId.lastName}
                                </h1>
                                <h1 className="text-center text-sm">{subscription.userId.email}</h1>
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
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => handleStatusChange(subscription._id, "cancelled")}
                                            >
                                                Cancelled
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <EllipsisVertical className="cursor-pointer mx-auto" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHandling;