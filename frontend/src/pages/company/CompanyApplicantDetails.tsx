import React, { useEffect, useState } from "react";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { CiStickyNote } from "react-icons/ci";
import { FcGoogle } from "react-icons/fc";
import { useParams } from "react-router-dom";
import { getApplicantDetials } from "../../services/company/compayJob";
import { JobApplication } from "../../types/types";
import { MdArrowDropDown } from "react-icons/md";
import { updateStatus } from "../../services/company/compayJob";
import { ApplicationStatus } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { getConversations, InitializeChat } from "../../services/messageService";

const CompanyApplicantDetails = () => {
    const [selected, setSelected] = useState<string | undefined>("Job Listing");
    const [heading, setHeading] = useState("Application");
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<JobApplication>();
    const [status, setStatus] = useState<ApplicationStatus>("pending")
    const { applicationId } = useParams();

    const navigate = useNavigate()

    const handleDetails = async () => {
        try {
            const response = await getApplicantDetials(applicationId || "");
            setDetails(response.applicant);
        } catch (error) {
            console.log("Error in fetching the applicant details ", error);
        } finally {
            setLoading(true);
        }
    };

    const handleUpdateStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        try {
            const newStatus = e.target.value as ApplicationStatus
            setStatus(newStatus)
            const response = await updateStatus(applicationId || "", newStatus);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleStartChat = async () => {
        if (!details?.userId._id) return
        const companyId = details?.jobId.company;
        const userId = details.userId._id
        const existingConversations = await getConversations(companyId, "company")

        const existingConversation = existingConversations.find(
            (conv: any) => conv.targetId === userId || conv.channel === `chat:${companyId}:${userId}`
        );
        try {
            if (existingConversation && existingConversation.channel) {
                navigate("/company-messages", {
                    state: {
                        newConversation: {
                            userId: existingConversation.targetId,
                            userName: existingConversation.targetName || `${details.userId.firstName} ${details.userId.lastName || ""}`,
                            lastMessage: existingConversation.lastMessage || "Chat started",
                            timestamp: existingConversation.timestamp || new Date().toISOString(),
                            channel: existingConversation.channel,
                        },
                    },
                });
            } else {
                const response = await InitializeChat(companyId, details.userId._id, "company");
                if (response && response.channel) {
                    navigate("/company-messages", {
                        state: {
                            newConversation: {
                                userId: details.userId._id,
                                userName: `${details.userId.firstName} ${details.userId.lastName || ""}`,
                                lastMessage: "Chat started",
                                timestamp: new Date().toISOString(),
                                channel: response.channel,
                            },
                        },
                    });
                } else {
                    console.warn("No channel returned from InitializeChat");
                }
            }

        } catch (error) {
            console.error("Error initializing or finding chat:", error);

        }
    }
    useEffect(() => {
        handleDetails();
    }, [applicationId]);

    const getDownloadableLink = (resumeUrl: string) => {
        return resumeUrl.replace("/upload/", "/upload/fl_attachment:");
    };

    return (

        <div className="flex overflow-hidden">
            <CompanySidebar setSelected={setSelected} />
            <div
                className="bg-[#F6F6F6] w-full overflow-x-hidden relative"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                <ComapanyHeader heading={heading} />
                <div className="flex">
                    <div className="w-full md:w-1/2 p-6">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <div className="flex items-center">
                                <img
                                    src={details?.userId.profileImage || ""}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <div className="ml-5">
                                    <h1 className="font-bold text-2xl">
                                        {details?.userId.firstName}
                                        {details?.userId.lastName}
                                    </h1>
                                    <h3 className="text-gray-600 text-lg">
                                        {details?.jobId.jobTitle}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {details?.appliedAt}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex justify-between items-center px-4">
                                    <h1 className="font-bold text-lg">Applied Job</h1>
                                    <p className="text-sm text-gray-500">2 Days ago</p>
                                </div>
                                <hr className="my-3" />
                                <div className="px-4">
                                    <h3 className="font-medium text-xl">
                                        {details?.jobId.jobTitle}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {details?.jobId.typesOfEmployment}
                                    </p>
                                </div>
                                <div className="mt-6 flex justify-end space-x-4">
                                    <div className="relative">
                                        <select
                                            value={status}
                                            onChange={handleUpdateStatus}
                                            className="appearance-none flex bg-white shadow-md font-semibold rounded-lg px-5 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="reviewed">Reviewed</option>
                                            <option value="accepted">Accepted</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                        <MdArrowDropDown className="absolute top-2 right-2 w-7 h-7 pointer-events-none" />
                                    </div>

                                    <button className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center" onClick={handleStartChat} disabled={!details?.userId._id}>
                                        <BsChatLeftText className="mr-2 w-5 h-5" />
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 p-6 space-y-5">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <h1 className="font-semibold text-xl mb-4">Contact</h1>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <MdOutlineMail className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-700">Email</p>
                                        <p className="text-gray-900">{details?.userId.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <IoPhonePortraitOutline className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-700">Phone</p>
                                        <p className="text-gray-900">
                                            {details?.userId.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FaLinkedin className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="text-sm text-gray-700">LinkedIn</p>
                                        <p className="text-gray-900">linkedin.com/jhon</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-lg rounded-xl h-20 flex items-center justify-between px-6">
                            <div className="flex items-center space-x-3">
                                <CiStickyNote className="w-6 h-6 text-gray-600" />
                                <p className="text-gray-900">{details?.userId.resume ? "Resume.pdf" : ""}</p>
                            </div>
                            <BsDownload className={`w-6 h-6 text-gray-600  hover:text-gray-800 ${details?.userId.resume ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                                }`} onClick={(e) => {
                                    if (!details?.userId.resume) {
                                        e.preventDefault()
                                        return
                                    } window.open(getDownloadableLink(details.userId.resume), "_blank")
                                }} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row space-y-5 md:space-y-0 md:space-x-6 p-2 px-6">
                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-xl p-6">
                        <h1 className="font-semibold text-xl mb-4">
                            Employment Experience
                        </h1>
                        {details?.userId?.experiences && details.userId.experiences.length > 0 ? (
                            details.userId.experiences.map((exp, index) => (
                                <div key={index} className="flex items-start space-x-4 mt-4">
                                    <FcGoogle className="w-8 h-8" />
                                    <div>
                                        <h1 className="font-bold text-lg">{exp.position || "No position specified"}</h1>
                                        <p className="text-md text-gray-700">{exp.company || "No company specified"}</p>
                                        <p className="text-sm text-gray-600">
                                            {exp.startDate
                                                ? `${new Date(exp.startDate).toLocaleDateString()} - ${exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"
                                                }`
                                                : "Dates not available"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-2">No experience details available.</p>
                        )}


                    </div>

                    <div className="w-full md:w-1/2 bg-white shadow-lg rounded-xl p-6">
                        <h1 className="font-semibold text-xl mb-4">Education</h1>

                        {details?.userId?.education && details.userId.education.length > 0 ? (
                            details.userId.education.map((edu, index) => (
                                <div key={index} className="flex items-start space-x-7 mt-4">
                                    <img
                                        src="https://via.placeholder.com/32"
                                        alt={edu.school || "Institution"}
                                        className="w-8 h-8 rounded-full object-contain"
                                    />
                                    <div>
                                        <h1 className="font-bold text-lg">{edu.school || "Institution not specified"}</h1>
                                        <p className="text-sm text-gray-600">{edu.degree || "Degree not specified"}</p>
                                        <p className="text-sm text-gray-600">
                                            {edu.startDate
                                                ? `${new Date(edu.startDate).toLocaleDateString()} - ${edu.startDate ? new Date(edu.startDate).toLocaleDateString() : "Present"
                                                }`
                                                : "Dates not available"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-2">No education details available.</p>
                        )}


                    </div>
                </div>
                <div className="p-6">
                    <div className="bg-white shadow-lg rounded-xl p-6">
                        <h1 className="font-semibold text-xl mb-4">Skills</h1>
                        <div className="flex flex-wrap gap-3">
                            {details?.userId?.skills && details.userId.skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {details.userId.skills.map((skill, index) => (
                                        <div key={index} className="bg-orange-100 rounded-lg px-3 py-1">
                                            <p className="text-sm text-gray-800">{skill}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 mt-2">No skills added yet.</p>
                            )}



                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CompanyApplicantDetails;
