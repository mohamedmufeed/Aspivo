import CompanySidebar from "../../components/Company/ComapnySidebar"
import ComapanyHeader from "../../components/Company/ComapanyHeader"
import { EllipsisVertical } from "lucide-react";
import { useState } from "react"
const CompanyJobListing = () => {
    const [selected, setSelected] = useState("Job Listing")
    const [heading, setHeading] = useState("All Jobs")
    return (
        <div className="flex">
            <CompanySidebar setSelected={setSelected} />
            <div className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
                style={{ fontFamily: "DM Sans, sans-serif" }}>
                <ComapanyHeader heading={heading} />
                <div>
                <div className="w-full p-5">
          {/* Header Row */}
          <div className="grid grid-cols-7 items-center font-medium bg-gray-100 p-3 rounded-md">
            <p className="text-center">Role</p>
            <p className="text-center">Status</p>
            <p className="text-center">Start date</p>
            <p className="text-center">Due date</p>
            <p className="text-center">Type</p>
            <p className="text-center">Applicants</p>
            <p className="text-center">More</p>
          </div>
          <hr className="border-gray-600 my-3" />

          {/* {currentUsers.map((user, index) => ( */}
            <div
            //   key={index}
              className="grid grid-cols-6  items-center bg-white shadow-lg p-4 rounded-md my-2"
            >
              <div className="flex justify-center">
                <img
                //   src={user.profileImage ? user.profileImage : profileAvathar}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <h1 className="text-center"></h1>
              <h1 className="text-center text-sm"></h1>
              <h1 className="text-center"></h1>
              <div className="flex justify-center space-x-4">
                <button className="bg-orange-600 p-2 px-4 text-white rounded-lg"  >
                  {/* {user.isBlocked ? "Unblock" : "Block"} */}
                </button>
              </div>
              <EllipsisVertical className="cursor-pointer ml-20" />
            </div>
          {/* ))} */}


        </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyJobListing