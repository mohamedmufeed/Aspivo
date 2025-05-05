import { IoIosSearch } from "react-icons/io";
import Navbar from "../../components/homecomponts/Navbar";
import { useNavigate } from "react-router-dom";
import { fetchJob, savedJobs, saveJob } from "../../services/jobService";
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { ISavedJobs, JobData } from "../../types/types";
import _ from "lodash";
import { CiBookmark } from "react-icons/ci";
import { useSelector } from "react-redux";
import { IoBookmark } from "react-icons/io5";
import { RootState } from "../../redux/store/store";

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
    const categoryItems = ["All", "Developer", "UI Design", "Product Designer", "Finance", "Sales"];
    const [jobs, setJobs] = useState<JobData[]>([]);
    const [searchWord, setSearchWord] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const isLoadingRef = useRef(false);
    const [userSavedJobs, setUserSavedJobs] = useState<ISavedJobs[]>([])
    const limit = 9;

    const loadJobs = useCallback(async (options: { resetPage?: boolean; newCategory?: boolean; newSearch?: boolean } = {}) => {
        const { resetPage = false, newCategory = false, newSearch = false } = options;
        if (isLoadingRef.current) return;
        isLoadingRef.current = true;
        setLoading(true);

        try {
            const currentPage = resetPage ? 1 : page;
            if (resetPage) {
                setPage(1);
            }
            const categoryParam = selectedCategory === "All" || !selectedCategory ? undefined : selectedCategory;
            const response = await fetchJob({
                page: currentPage,
                limit,
                search: searchWord,
                category: categoryParam
            });

            if (!response) {
                console.error("No response from server");
                return;
            }
            if (resetPage) {
                setJobs(response.job || []);
            } else {
                setJobs(prevJobs => [...prevJobs, ...(response.job || [])]);
            }

            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
            setInitialLoad(false);
        }
    }, [page, searchWord, selectedCategory]);
    const debouncedSearch = useMemo(() =>
        _.debounce(() => {
            if (!initialLoad) {
                loadJobs({ resetPage: true, newSearch: true });
            }
        }, 500),
        [loadJobs, initialLoad]
    );
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchWord(e.target.value);
        debouncedSearch();
    };

    const handleCategoryClick = (category: string) => {
        const newCategory = category === "All" ? null :
            (selectedCategory === category ? null : category);

        setSelectedCategory(newCategory);

        if (!initialLoad) {
            debouncedSearch.cancel();
            setTimeout(() => {
                loadJobs({ resetPage: true, newCategory: true });
            }, 0);
        }
    };
    const handleLoadMore = () => {
        setPage(prevPage => prevPage + 1);
        setTimeout(() => {
            loadJobs();
        }, 0);
    };
    useEffect(() => {
        loadJobs({ resetPage: true });
        return () => {
            debouncedSearch.cancel();
        };
    }, []);
    const user = useSelector((state: RootState) => state.auth.user)
    const userId = user?._id || ""

    const handleSavingJob = async (jobId: string | undefined) => {
        if (!jobId) return
        try {
           await saveJob(userId, jobId)
            setUserSavedJobs(prevSaved  => {
                const alredySaved = prevSaved.find(saved => saved.jobId === jobId)
                if (alredySaved) {
                    return prevSaved.filter(saved => saved.jobId != jobId)
                } else {
                    return [...prevSaved, { jobId, savedAt: new Date().toISOString() }];
                }
            })
        } catch (error) {
            console.error("Error on saving Job",error)
        }
    }

    useEffect(() => {

        const fetchSavedJobs = async () => {
            try {
                const response = await savedJobs(userId)
                setUserSavedJobs(response.savedJobs)
            } catch (error) {
                console.error("Error on fethicing the saved jobs",error)
            }
        }
        if (userId) {
            fetchSavedJobs()
        }
    }, [userId])
    return (
        <div className="bg-[#F6F6F6] min-h-screen sm:pb-20" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <Navbar />
            <div>
                <div className="flex justify-center mt-10">
                    <div className="bg-white shadow-lg sm:w-1/2 rounded-lg p-2 flex items-center">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by job title, company, or location"
                            className="text-black w-full p-4 sm:ml-5 outline-none font-extralight"
                            value={searchWord}
                            onChange={handleSearchChange}
                        />
                        <button className="w-20 h-14 ml-auto mr-1 flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer">
                            <IoIosSearch className="w-6 h-6" />
                        </button>
                    </div>
                </div>


                <div className="flex justify-center  gap-2 sm:gap-6 mt-9 overflow-x-auto scrollbar-hide">
                    {categoryItems.map((item, index) => (
                        <div key={index}>
                            <button
                                className={`bg-orange-600 shadow-lg rounded-xl text-sm sm:text-base p-2 sm:p-3 px-5 font-medium cursor-pointer hover:bg-orange-500 hover:text-white 
                                    ${(item === "All" && selectedCategory === null) || selectedCategory === item
                                        ? "bg-orange-600 text-white"
                                        : "bg-white"
                                    }`}
                                onClick={() => handleCategoryClick(item)}
                            >
                                {item}
                            </button>

                        </div>
                    ))}
                </div> 





                <div className="px-8 sm:px-20 mt-10 space-y-6">
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
                             className="bg-white shadow-lg rounded-lg grid grid-cols-12 gap-4 sm:p-4 p-3 items-center hover:bg-gray-50"
                         >
                         
                         <div className="col-span-2 flex justify-center">
                                        {job.company?.logo ? (
                                            <img
                                                src={`https://res.cloudinary.com/do4wdvbcy/image/upload/${job.company.logo}`}
                                                alt={`${job.company.companyName || "Company"} logo`}
                                                className="w-10 h-10 object-contain"
                                                onError={(e) => (e.currentTarget.src = "/default-logo.png")}
                                            />
                                        ) : (
                                            <span className="text-gray-500">No logo</span>
                                        )}
                                    </div>
                                    <div className="col-span-7 sm:col-span-3">
                                        <h1 className="font-semibold text-md sm:text-xl">{job.jobTitle || "N/A"}</h1>
                                        <p className=" text-xs sm:text-sm text-gray-700">{job.company?.companyName || "N/A"}</p>
                                    </div>

                                    <div className="hidden sm:block col-span-2">
                                        <h1 className="font-semibold text-xl">{job.company?.location || "N/A"}</h1>
                                        <p className="text-sm text-gray-700">Location</p>
                                    </div>

                           <div className="hidden sm:block col-span-2">
                                        <h1 className="font-semibold text-xl">
                                            {job.minimumSalary && job.maximumSalary
                                                ? `${formatSalary(job.minimumSalary)} - ${formatSalary(job.maximumSalary)}`
                                                : "N/A"}
                                        </h1>
                                        <p className="text-sm text-gray-700">Yearly</p>
                                    </div>
                                    <div className="hidden sm:flex col-span-2 justify-center">
                                        {userSavedJobs.some((saved) => saved.jobId.toString() === job._id?.toString()) ? (
                                            <IoBookmark className="w-6 h-6" onClick={() => handleSavingJob(job._id)} />
                                        ) : (
                                            <CiBookmark className="w-6 h-6" onClick={() => handleSavingJob(job._id)} />
                                        )
                                        }
                                    </div>
                                    <div className="col-span-3 sm:col-span-1 flex justify-center">
                                        <button
                                            className="bg-orange-600 text-white font-medium sm:font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-md sm:rounded-lg cursor-pointer hover:bg-orange-700"
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


                    {jobs.length > 0 && page < totalPages && (
                        <div className="flex justify-center mt-10">
                            <button
                                className="bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-700 disabled:bg-gray-400"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading && page > 1 ? (
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