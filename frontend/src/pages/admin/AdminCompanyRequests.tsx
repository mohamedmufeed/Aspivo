import Sidebar from "../../components/Admin/Sidebar";
import { useEffect, useState } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import profile from "../../assets/person_1.jpg";
import { EllipsisVertical, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { getAllCompany, updateCompanyStatus } from "../../services/adminService";
import AdminHeader from "../../components/Admin/AdminHeader";

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
                <AdminHeader heading="Requests"/>
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