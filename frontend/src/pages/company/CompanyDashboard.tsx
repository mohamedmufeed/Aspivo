import { useEffect, useState } from "react";
import { fetchCompany } from "../../services/company/compayJob";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useNavigate } from "react-router-dom";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import { TfiStatsUp } from "react-icons/tfi";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import { GoBriefcase, GoDownload, } from "react-icons/go";
import StatCarsComponent from "../../components/Admin/StatCarsComponent";
import { Legend, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { getCompanyApplicationByDate, getCompanyDashboardStats } from "../../services/company/companyDashboard";

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
        setCompanyId(response.company.company._id)
        if (!response) {
          navigate("/company-signup");
        }
        if (response.company.company.status != "Approved") {
          navigate("/success")
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
        console.log(" the response", response)
      } catch (error) {
        console.error("Erro on fetching company application by date ", error);
      }
    }
    if (companyId) {
      fetchCompanyApplicationByDate()
    }

  }, [companyId, fromDate, toDate])


  const data = [
    { name: "Short Listed", value: 1120, fill: "#F4B942" },
    { name: "Hired", value: 12423, fill: "#6592FD" },
    { name: "Rejected", value: 12423, fill: "#0E1B25" },
  ];

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
              Good Morning
            </h1>
            <p className="text-md font-normal text-gray-600">
              Here's your admin dashboard overview for today
            </p>
          </div>
          {/* <div className="border rounded-lg shadow-sm flex items-center px-3 h-12 self-start">
            <GoCalendar className="text-gray-500 mr-2" />
            <select
              className="bg-transparent focus:outline-none py-2 text-gray-700 cursor-pointer"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              {weekOptions.map((range, idx) => (
                <option key={idx} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div> */}

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
          {/* Applicatoin  Chart */}


          <div className="bg-white p-6 rounded-xl shadow-md w-full h-[400px] ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Application Response</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors" title="Download Report">
                <GoDownload className="w-5 h-5" />
              </button>
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
                  {data.map((entry, index) => (
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
          </div>

          {/* Subscription Revenue Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md w-full h-[400px] ">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Top Performing Jobs</h2>
            </div>
            <hr />
            <div className="p-7 flex space-x-3.5">
              <div className="flex justify-center items-center">
                <div className=" rounded-full p-1.5 bg-orange-300"></div>
              </div>

              <div>
                <h1 className="font-bold ">Frontend Developer - 3 Applications</h1>
                <p className="text-sm text-gray-700">Posted on 2/03/2024</p>
              </div>

            </div>

          </div>

        </div>


      </div>
    </div>
  );
};

export default CompanyDashboard;
