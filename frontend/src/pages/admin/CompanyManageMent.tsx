import Sidebar from "../../components/Admin/Sidebar";
import { useCallback, useEffect, useRef, useState } from "react"
import { EllipsisVertical, ChevronLeft, ChevronRight } from "lucide-react";
import { approvedCompany } from "../../services/adminService";
import AdminHeader from "../../components/Admin/AdminHeader";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/Admin/SearchBar";

interface Company {
    _id: string;
    companyName: string;
    email: string;
    status: string;
    createdAt: string;
    kyc?: string;
}

const AdminCompanyRequests = () => {
    const location = useLocation()

    const [companyDetail, setCompanyDetail] = useState<Company[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const companiesPerPage = 6
    const [totalPages, setTotalPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState("")
    const [totalCompanies, setTotalCompanies] = useState(0)
    const [loading, setLoading] = useState(false)
    const prevRequestRef = useRef<AbortController | null>(null)
console.log(totalCompanies)
    const fetchCompany = async (page = 1, query = "") => {
        if (prevRequestRef.current) {
            prevRequestRef.current.abort()
        }
        const abortController = new AbortController()
        prevRequestRef.current = abortController
        setLoading(true)
        try {
            const response = await approvedCompany(page, companiesPerPage, query, abortController.signal);
            console.log("the response",response)
            if (prevRequestRef.current === abortController) {
                setCompanyDetail(response.company);
                setTotalCompanies(response.totalCompanies)
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
            fetchCompany(page, query);
        }, 300),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedFetch(currentPage, searchQuery)
        } else {
            fetchCompany(currentPage, searchQuery)
        }

    }, [currentPage, searchQuery, location])


    const handleSeach = (query: string) => {
        setSearchQuery(query)
        if (currentPage !== 1) setCurrentPage(1)
        debouncedFetch(1, query)
    }

   

    return (
        <div className="flex">
            <Sidebar  />
            <div className="bg-[#F6F6F6] w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <AdminHeader heading="Companies" />
                <SearchBar placeholder="Serach Company..." onSearch={handleSeach} />
                <div className="w-full p-5">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 items-center font-semibold bg-gray-100 p-3 rounded-md">
                        <p className="text-center">Company Name</p>
                        <p className="text-center">Email</p>
                        <p className="text-center">Status</p>
                        <p className="text-center">Created At</p>
                        <p className="text-center">View KYC</p>
                        <p className="text-center">Actions</p>
                    </div>
                    <hr className="border-gray-600 my-3" />
                    {loading ? (
                        <p className="text-center text-gray-500 mt-5">Loading...</p>
                    ) : companyDetail && companyDetail.length > 0 ? (
                        companyDetail.map((company) => (
                            <div key={company._id} className="grid grid-cols-6 items-center bg-white shadow-md p-4 rounded-lg my-2">
                                <h1 className="text-center font-medium">{company.companyName}</h1>
                                <h1 className="text-center text-sm text-gray-600">{company.email}</h1>
                                <h1 className="text-center font-medium">{company.status}</h1>
                                <h1 className="text-center text-sm text-gray-500">
                                    {new Date(company.createdAt).toLocaleDateString()}
                                </h1>
                                <div className="text-center">
                                    {company.kyc ? (
                                        <a
                                            href={company.kyc}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-blue-800 "

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