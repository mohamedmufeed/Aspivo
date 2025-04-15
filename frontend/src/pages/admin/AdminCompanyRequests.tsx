import Sidebar from "../../components/Admin/Sidebar";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import profile from "../../assets/person_1.jpg";
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getAllCompany, updateCompanyStatus } from "../../services/adminService";

interface Company {
    _id: string;
    companyName: string;
    email: string;
    status: string;
    createdAt: string;
    kyc?: string;
}

const AdminCompanyRequests = () => {
    const [selected, setSelectedMenu] = useState("Dashboard");
    const [companyDetail, setCompanyDetail] = useState<Company[]>([]);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [companiesPerPage] = useState(7);
    const totalPages = Math.ceil((companyDetail?.length || 0) / companiesPerPage);
    const indexOfLastCompany = currentPage * companiesPerPage;
    const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
    const currentCompanies = companyDetail?.slice(indexOfFirstCompany, indexOfLastCompany) || [];

    const handleStatusChange = async (companyId: string, newStatus: string) => {
        try {
            await updateCompanyStatus(companyId, newStatus);
            setCompanyDetail((prevDetails = []) =>
                prevDetails.map((company) =>
                    company._id === companyId ? { ...company, status: newStatus } : company
                )
            );
            setCurrentPage(1); 
            setOpenDropdown(null);
        } catch (error) {
            console.error("Error updating company status:", error);
        }
    };

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await getAllCompany();
                console.log(" thre reposen",response.companies
                );
                setCompanyDetail(response.companies);
                setCurrentPage(1); 
            } catch (error) {
                console.log("error in fetching company");
            }
        };
        fetchCompany();
    }, []);

    return (
        <div className="flex">
            <Sidebar setSelected={setSelectedMenu} />
            <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="flex justify-between space-x-10">
                    <div className="flex mt-10">
                        <IoChevronBackOutline className="w-8 h-8 ml-3 mr-6" />
                        <h1 className="text-3xl font-medium -mt-0">Requests</h1>
                    </div>

                    <div className="flex p-3 mt-5 px-15">
                        <div className="cursor-pointer font-medium hover:text-orange-600 mr-15 mt-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 36 36">
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

                        <div className="bg-orange-600 w-13 border-orange-600 border-3 rounded-full">
                            <img className="w-12 h-12 p-1 bg-white rounded-full" src={profile} alt="" />
                        </div>
                    </div>
                </div>
                <hr className="border border-gray-700" />

                <div className="w-full p-5">
                    {/* Header Row */}
                    <div className="grid grid-cols-7 items-center font-semibold bg-gray-100 p-3 rounded-md">
                        <p className="text-center">Company Name</p>
                        <p className="text-center">Email</p>
                        <p className="text-center">Status</p>
                        <p className="text-center">Created At</p>
                        <p className="text-center">Change Status</p>
                        <p className="text-center">View KYC</p>
                        <p className="text-center">Actions</p>
                    </div>
                    <hr className="border-gray-600 my-3" />

                    {currentCompanies && currentCompanies.length > 0 ? (
                        currentCompanies.map((company) => (
                            <div key={company._id} className="grid grid-cols-7 items-center bg-white shadow-md p-4 rounded-lg my-2">
                                <h1 className="text-center font-medium">{company.companyName}</h1>
                                <h1 className="text-center text-sm text-gray-600">{company.email}</h1>
                                <h1 className="text-center font-medium">{company.status}</h1>
                                <h1 className="text-center text-sm text-gray-500">
                                    {new Date(company.createdAt).toLocaleDateString()}
                                </h1>

                                <div className="relative flex justify-center">
                                    <button
                                        className={`px-4 py-2 text-white rounded-md flex items-center bg-orange-600`}
                                        onClick={() => setOpenDropdown(openDropdown === company._id ? null : company._id)}
                                    >
                                        {company.status}
                                        <ChevronDown className="ml-2 w-4 h-4" />
                                    </button>

                                    {openDropdown === company._id && (
                                        <div className="absolute top-full mt-2 bg-white shadow-md rounded-md w-28 text-center z-10">
                                            <button
                                                className="block w-full px-4 py-2 hover:bg-green-100 text-green-600"
                                                onClick={() => handleStatusChange(company._id, "Approved")}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="block w-full px-4 py-2 hover:bg-red-100 text-red-600"
                                                onClick={() => handleStatusChange(company._id, "Declined")}
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center">
                                    {company.kyc ? (
                                        <a
                                            href={company.kyc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-800"
                                        >
                                            View KYC
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">No KYC</span>
                                    )}
                                </div>

                                <div className="flex justify-center">
                                    <EllipsisVertical className="cursor-pointer text-gray-600 hover:text-gray-800" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-5">No company requests available.</p>
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

export default AdminCompanyRequests;