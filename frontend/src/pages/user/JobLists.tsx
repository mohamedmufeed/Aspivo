import { IoIosSearch } from "react-icons/io";
import Navbar from "../../components/homecomponts/Navbar";
import { useNavigate } from "react-router-dom";
import { fetchJob } from "../../services/jobService";
import { useEffect, useState, useCallback } from "react";
import { JobData } from "../../types/types";
import _ from "lodash";

const formatSalary = (amount: number): string => {
    if (amount >= 10000000) {
        return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
        return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
        return `₹${(amount / 1000).toFixed(0)}k`;
    } else {
        return `₹${amount}`;
    }
};

const JobLists = () => {
    const navigate = useNavigate();
    const categoryItems = ["All","Developer", "UI Design", "Product Designer", "Finance", "Sales"];
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [searchWord, setSearchWord] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const limit = 9;

    const loadJobs = useCallback(async (newSearch = false) => {
        if (loading) return;
        
        setLoading(true);
        
        try {
            const currentPage = newSearch ? 1 : page;
            if (newSearch) {
                setPage(1);
            }
            
            const response = await fetchJob({ 
                page: currentPage, 
                limit, 
                search: searchWord, 
                category: selectedCategory || undefined 
            });
            
            if (!response) {
                console.error("No response from server");
                return;
            }
            
            const newJobs = response.job || [];
            
            if (newSearch) {
                setJobs(newJobs);
            } else {
                setJobs(prevJobs => [...prevJobs, ...newJobs]);
            }
            
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [page, searchWord, selectedCategory, loading]);


    const debouncedSearch = useCallback(
        _.debounce(() => {
            loadJobs(true);
        }, 500),
        [loadJobs]
    );

 
    useEffect(() => {
        if (initialLoad) {
            loadJobs();
        }
    }, [initialLoad, loadJobs]);


    useEffect(() => {
        if (!initialLoad) {
            debouncedSearch();
        }
        return () => {
            debouncedSearch.cancel();
        };
    }, [searchWord, debouncedSearch, initialLoad]);


    useEffect(() => {
        if (!initialLoad) {
            loadJobs(true);
        }
    }, [selectedCategory, loadJobs, initialLoad]);

    
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
    };


    useEffect(() => {
        if (page > 1) {
            loadJobs();
        }
    }, [page, loadJobs]);

    const handleCategoryClick = (category: string) => {
        setSelectedCategory(selectedCategory === category ? null : category);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
    };

    return (
        <div className="bg-[#F6F6F6] min-h-screen pb-20" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <Navbar />
            <div>
                {/* Search Bar */}
                <div className="flex justify-center mt-10">
                    <div className="bg-white shadow-lg w-1/2 rounded-lg p-2 flex items-center">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by job title, company, or location"
                            className="text-black w-full p-4 ml-5 outline-none font-extralight"
                            value={searchWord}
                            onChange={handleSearchChange}
                        />
                        <button className="w-20 h-14 ml-auto mr-1 flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
                            <IoIosSearch className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Advanced Search - Categories */}
                <div className="flex justify-center gap-6 mt-9">
                    {categoryItems.map((item, index) => (
                        <div key={index}>
                            <button
                                className={`bg-white shadow-lg rounded-xl p-3 px-5 font-medium cursor-pointer hover:bg-orange-500 hover:text-white ${
                                    selectedCategory === item ? "bg-orange-600 text-white" : ""
                                }`}
                                onClick={() => handleCategoryClick(item)}
                            >
                                {item}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Job Listing */}
                <div className="px-20 mt-10 space-y-6">
                    {loading && initialLoad ? (
                        <div className="text-center py-10">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent"></div>
                            <p className="mt-2 text-gray-600">Loading jobs...</p>
                        </div>
                    ) : jobs.length > 0 ? (
                        <>
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className="bg-white shadow-lg rounded-lg grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50"
                                >
                                    <div className="col-span-2 flex justify-center">
                                        {job.company?.logo ? (
                                            <img
                                                src={job.company.logo}
                                                alt={`${job.company.companyName || "Company"} logo`}
                                                className="w-10 h-10 object-contain"
                                                onError={(e) => (e.currentTarget.src = "/default-logo.png")}
                                            />
                                        ) : (
                                            <span className="text-gray-500">No logo</span>
                                        )}
                                    </div>
                                    <div className="col-span-3">
                                        <h1 className="font-semibold text-xl">{job.jobTitle || "N/A"}</h1>
                                        <p className="text-sm text-gray-700">{job.company?.companyName || "N/A"}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <h1 className="font-semibold text-xl">{job.company?.location || "N/A"}</h1>
                                        <p className="text-sm text-gray-700">Location</p>
                                    </div>
                                    <div className="col-span-2">
                                        <h1 className="font-semibold text-xl">
                                            {job.minimumSalary && job.maximumSalary
                                                ? `${formatSalary(job.minimumSalary)} - ${formatSalary(job.maximumSalary)}`
                                                : "N/A"}
                                        </h1>
                                        <p className="text-sm text-gray-700">Yearly</p>
                                    </div>
                                    <div className="col-span-2 flex justify-center">
                                        <span className="text-gray-700">save</span>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button
                                            className="bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-orange-700"
                                            onClick={() => navigate(`/job-details/${job._id}`)}
                                        >
                                            More
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-xl text-gray-600">No jobs found matching your criteria</p>
                            <p className="mt-2 text-gray-500">Try adjusting your search or category filter</p>
                        </div>
                    )}

                    {/* Load More Button */}
                    {jobs.length > 0 && page < totalPages && (
                        <div className="flex justify-center mt-10">
                            <button
                                className="bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="inline-block mr-2 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                                        Loading...
                                    </>
                                ) : (
                                    "Load More"
                                )}
                            </button>
                        </div>
                    )}
                    
                    {jobs.length > 0 && page >= totalPages && (
                        <div className="text-center py-4 text-gray-600">
                            No more jobs to load
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobLists;