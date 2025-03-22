import { useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar"
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import profie from "../../assets/person_1.jpg"

const CompanyApplicantDetails = () => {
    const [selected, setSelected] = useState("Job Listing");
    const [heading, setHeading] = useState("Application");
    return (
        <div className="flex">
            <CompanySidebar setSelected={setSelected} />
            <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <ComapanyHeader heading={heading} />
                <div className="flex">

                    <div className="bg-white shadow-lg rounded-xl w-1/2 mt-5 ml-6 p-5 ">

                        <div className="flex items-center">
                            <img src={profie} alt="Profile" className="w-30 h-30 rounded-full  p-2" />
                            <div className="ml-5">
                                <h1 className="font-bold text-2xl">John Doe</h1>
                                <h3 className="text-gray-600 text-lg">Software Engineer</h3>
                                <p className="text-sm text-gray-500">Last updated: 09-Sep-2024</p>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between px-4 mt-8">
                                <h1 className="font-bold text-l">Applied job</h1>
                                <p className="text-sm">2 Day ago</p>
                            </div>
                            <hr className="mt-1" />
                            <div className="px-5">
                                <h3 className="font-medium  text-xl pt-5">Senior Developer</h3>
                                <p className="text-sm  text-gray-600">Full-time</p>
                            </div>
                            <div className="space-x-6 flex justify-end">
                                <button className="bg-white shadow-xl  font-bold rounded-lg p-3">Change Status</button>
                                <button className="bg-orange-600 p-3 rounded-lg text-white font-bold">Chat</button>
                            </div>
                        </div>

                    </div>

                    <div className=" w-1/2 mt-5 ml-6 ">

                        <div className="bg-white shadow-lg rounded-xl">
                            <h1>Contact</h1>
                            <div className="flex">
                                <div>
                                    <img src="" alt="" />
                                </div>
                                <div>
                                    <p>Email</p>
                                    <p>Hello@gmail.com</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            w
                        </div>
                    </div>


                </div>



            </div>
        </div>
    )
}

export default CompanyApplicantDetails