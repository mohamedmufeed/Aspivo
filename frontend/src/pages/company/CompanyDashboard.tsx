import { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { TfiStatsUp } from "react-icons/tfi";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import { GoBriefcase,  } from "react-icons/go";
import StatCarsComponent from "../../components/Admin/StatCarsComponent";
import { Legend, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getCompanyApplicationByDate, getCompanyDashboardStats, getMostAppliedJobs } from "../../services/company/companyDashboard";
import { getGreeting } from "../../utils/dasboardUtils";

export interface IState {
  diff: number;
  direction: string;
  lastWeek: number;
  percentage: string;
  total: number
}

type PieChartData = {
  name: string;
  value: number;
  fill: string;
};


interface IAppliedJobs {
  _id: string;
  count: number
  jobTitle: string
  startDate: string
}


const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const user = useSelector((state: RootState) => state.auth.user);
  const [companyId, setCompanyId] = useState()
  const [appliationData, setApplicationData] = useState<IState>()
  const [numberOfHiringData, setNumberOfHiringData] = useState<IState>()
  const [jobData, setJobData] = useState<IState>()
  const [applicationChartData, setApplicationChartData] = useState<PieChartData[]>([])
  const [mostAppliedJobs, setMostAppliedJobs] = useState<IAppliedJobs[]>()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const userId = user?._id || "";
  useEffect(() => {
    if (!user) {
      navigate("/")
    }
  }, [])

  useEffect(() => {
    const handleCompany = async () => {
      try {
        if (!userId) return;
        const response = await fetchCompany(userId);
        const company = response?.company?.company;

        if (!company) {
          console.warn("No company found, redirecting to company signup.");
          return navigate("/company-signup");
        }
        setCompanyId(company._id) 
       if (response.company.company.status != "Approved") {
          navigate("/success")
        }
        if(company.subscription.status ==="active" && company.features.accessToAnalytics){
            setIsSubscribed(true)
        }
      } catch (error) {
        console.error("Error fetching company:", error);
      }
    };

    handleCompany();
  }, [userId, location]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (!companyId) return
        const response = await getCompanyDashboardStats(companyId)
        setJobData(response.jobs)
        setApplicationData(response.applications)
        setNumberOfHiringData(response.numberOfHirings)
      } catch (error) {
        console.error("Erro on fetching dashbord stats", error);

      }
    }
    if (companyId) {
      fetchDashboardStats()
    }
  }, [companyId])

  useEffect(() => {
    const fetchCompanyApplicationByDate = async () => {
      try {
        if (!companyId) return
        const response = await getCompanyApplicationByDate(companyId, fromDate, toDate)
        const appStats = response.response || {};

        const chartData = [
          { name: "Short Listed", value: appStats.shortlisted || 0, fill: "#F4B942" },
          { name: "Hired", value: appStats.hired || 0, fill: "#6592FD" },
          { name: "Rejected", value: appStats.rejected || 0, fill: "#0E1B25" },
        ];

        setApplicationChartData(chartData);
      } catch (error) {
        console.error("Erro on fetching company application by date ", error);
      }
    }
    if (companyId) {
      fetchCompanyApplicationByDate()
    }

  }, [companyId, fromDate, toDate])

  useEffect(() => {
    const fetchMostAppliedJobs = async () => {
      try {
        if (!companyId) return
        const response = await getMostAppliedJobs(companyId)
        setMostAppliedJobs(response.response)
      } catch (error) {
        console.error("Erron on fetching most applied jobs",error);

      }
    }
    if (companyId) {
      fetchMostAppliedJobs()
    }
  }, [companyId])


  const renderCustomLegend = () => {
    return (
      <ul className="space-y-10">
        {applicationChartData.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.fill }} />
            <div className="space-y-1" >
              <h1 className="text-sm text-gray-700">{entry.name}</h1>
              <p className="text-gray-400 text-sm">{entry.value}</p>
            </div>

          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex">
      <CompanySidebar />
      <div
        className="bg-[#F6F6F6] w-full  overflow-x-hidden relative"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {/*Comapny header */}
        <ComapanyHeader heading="Dashboard" />
        {/* dashbord header */}
        <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-8 pt-6 md:pt-10">
          <div className="space-y-2 mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {getGreeting()}
            </h1>
            <p className="text-md font-normal text-gray-600">
              Here's your admin dashboard overview for today
            </p>
          </div>

          <div className="flex space-x-3.5">
            <div className="flex flex-col">
              <label htmlFor="fromDate" className="text-sm text-gray-600 mb-1">From</label>
              <div className="border rounded-lg shadow-sm flex items-center px-3 h-12">
                <input
                  id="fromDate"
                  type="date"
                  className="bg-transparent focus:outline-none text-gray-700 cursor-pointer"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="toDate" className="text-sm text-gray-600 mb-1">To</label>
              <div className="border rounded-lg shadow-sm flex items-center px-3 h-12">
                <input
                  id="toDate"
                  type="date"
                  className="bg-transparent focus:outline-none text-gray-700 cursor-pointer"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>





        </div>

        {/* satusCard */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8 pt-6 md:pt-8">
          <StatCarsComponent
            title="Job Posts"
            value={jobData?.total}
            changeValue={jobData?.lastWeek}
            icon={<GoBriefcase className="w-6 h-6" />}
            trend={jobData?.direction}
          />
          <StatCarsComponent
            title="Total  Applications"
            value={appliationData?.total}
            changeValue={appliationData?.lastWeek}
            icon={<TfiStatsUp className="w-6 h-6" />}
            trend={appliationData?.direction}
          />
          <StatCarsComponent
            title="No of hirings"
            value={numberOfHiringData?.total}
            changeValue={numberOfHiringData?.lastWeek}
            icon={<GoBriefcase className="w-6 h-6" />}
            trend={numberOfHiringData?.direction}
          />
        </div>
        {/* job appliation deatails */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-8 pt-12 pb-8">

          <div className="relative bg-white p-6 rounded-xl shadow-md w-full h-[400px] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Application Response</h2>
            </div>
            <hr />
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={applicationChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  nameKey="name"
                >
                  {applicationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  iconType="circle"
                  content={renderCustomLegend}
                />
              </PieChart>
            </ResponsiveContainer>

            {!isSubscribed && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-700 font-semibold">Subscribe to view full insights</p>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Revenue Chart */}
          <div className=" relative bg-white p-6 rounded-xl shadow-md w-full h-[400px] ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Performing Jobs</h2>
            </div>
            <hr />

            {mostAppliedJobs && mostAppliedJobs.length > 0 ?
              (
                mostAppliedJobs.map((job) => (
                  <div key={job._id} className="p-7 flex space-x-3.5" >
                    <div className="flex justify-center items-center">
                      <div className=" rounded-full p-1.5 bg-orange-400"></div>
                    </div>

                    <div>
                      <h1 className="font-bold ">{`${job.jobTitle} - ${job.count} Applications`}</h1>
                      <p className="text-sm text-gray-600">{job?.startDate
                        ? `Posted ${new Date(job.startDate).toLocaleDateString()}`
                        : "Date not available"}</p>
                    </div>
                  </div>
                ))

              )
              :
              (
                <p className="flex justify-center items-center">No jobs found</p>
              )
            }
            {!isSubscribed && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
                <div className="text-center">
                  <p className="text-gray-700 font-semibold">Subscribe to view full insights</p>
                </div>
              </div>
            )}

          </div>

        </div>


      </div>
    </div>
  );
};

export default CompanyDashboard;
