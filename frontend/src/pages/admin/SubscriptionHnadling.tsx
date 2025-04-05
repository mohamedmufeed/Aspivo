import React, { useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import { IoChevronBackOutline } from "react-icons/io5";
import Profile from "../../assets/person_1.jpg"
import { EllipsisVertical } from "lucide-react";

const SubscriptionHnadling = () => {
    const [selected, setSelectedMenu] = useState("Subscription");
    return (
        <div className="flex">
            <Sidebar setSelected={setSelectedMenu} />
            <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <IoChevronBackOutline className="w-8 h-8 cursor-pointer" />
                        <h1 className="text-3xl font-medium ml-4">Subscription Management</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <img className="w-12 h-12 rounded-full border-2 border-orange-600" src={Profile} alt="Profile" />
                    </div>
                </div>

                <hr className="border-black border-1.5" />

                <div className="w-full p-5">
                    {/* Header Row */}
                    <div className="grid grid-cols-5 items-center font-medium bg-gray-100 p-3 rounded-md">
                        <p className="text-center">Full Name</p>
                        <p className="text-center">Email</p>
                        <p className="text-center">Created At</p>
                        <p className="text-center">Status</p>
                        <p className="text-center">More</p>
                    </div>
                    <hr className="border-gray-600 my-3" />


                    <div

                        className="grid grid-cols-5  items-center bg-white shadow-lg p-4 rounded-md my-2"
                    >

                        <h1 className="text-center">heello</h1>
                        <h1 className="text-center text-sm">hello</h1>
                        <h1 className="text-center">hello</h1>
                        <div className="flex justify-center space-x-4">
                            <button className="bg-orange-600 p-2 px-4 text-white rounded-lg"  >
                                hello
                            </button>
                        </div>
                        <EllipsisVertical className="cursor-pointer ml-20" />
                    </div>



                </div>



            </div>

        </div>
    )
}

export default SubscriptionHnadling