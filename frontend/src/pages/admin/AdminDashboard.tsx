import { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import { GoPeople, GoOrganization, GoBriefcase, GoDownload, GoCalendar } from "react-icons/go";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import StatCarsComponent from "../../components/Admin/StatCarsComponent";
import { downloadExcel, getDashboardStats, getMonthlySubscriptionRevenue, getWeeklyApplicationData } from "../../services/adminService";
import { getGreeting, getLastNWeeks } from "../../utils/dasboardUtils";

export interface IState {
  diff: number;
  direction: string;
  lastWeek: number;
  percentage: string;
  total: number
}
export interface IWeeklyApplicationDAta {
  name: string;
  applications: number
  interviews: number;
  pending: number;
  rejected: number
}
export interface IMonthlyRevenueData {
  name: string;
  subscription: number
}
const AdminDashboard = () => {
  const [userData, setUserData] = useState<IState>()
  const [companyData, setCompanyData] = useState<IState>()
  const [jobData, setJobData] = useState<IState>()
  const [dateRange, setDateRange] = useState("Feb 20 - Feb 26");
  const [applicationData, setApplicationData] = useState<IWeeklyApplicationDAta[]>()
  const [revenueData, setRevenueData] = useState<IMonthlyRevenueData[]>()
  const weekOptions = getLastNWeeks(7);

  useEffect(() => {
    const fetchDashbordStats = async () => {
      try {
        const response = await getDashboardStats()
        setUserData(response.users)
        setCompanyData(response.companies)
        setJobData(response.jobs)
        console.log(response)
      } catch (error) {
        console.error("Error fetching on dashbord stats", error);

      }
    }
    fetchDashbordStats()
  }, [])

  useEffect(() => {
    const fetchWeeklyApplicationData = async () => {
      try {
        const response = await getWeeklyApplicationData(dateRange)
        console.log("the response af", response)
        setApplicationData(response.response)
      } catch (error) {
        console.error("Error on fetching Weekly application data", error);

      }
    }
    fetchWeeklyApplicationData()
  }, [dateRange])

  useEffect(() => {
    const fetchMonthlyRevenueData = async () => {
      try {
        const response = await getMonthlySubscriptionRevenue()
        setRevenueData(response.response)
      } catch (error) {
        console.error("Error fetching monthly revenue data", error);

      }
    }
    fetchMonthlyRevenueData()
  }, [])


  const handleWeeklyApplicationDownload = async () => {
    try {
      await downloadExcel(dateRange, "ApplicationData")
    } catch (error) {
      console.error("Error on Download execel of Weekly application data");

    }
  }
  const handleRevenueDownload = async () => {
    try {
      await downloadExcel(dateRange, "RevenueData")
    } catch (error) {
      console.error("Error on Download execel of Revenue data");

    }
  }



  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <Sidebar />
        <div className="bg-gray-50 w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <AdminHeader heading="Dashboard" />

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-8 pt-6 md:pt-10">
            <div className="space-y-2 mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {getGreeting()}
              </h1>
              <p className="text-md font-normal text-gray-600">
                Here's your admin dashboard overview for today
              </p>
            </div>
            <div className="border rounded-lg shadow-sm flex items-center px-3 h-12 self-start">
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
            </div>
          </div>



          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-8 pt-6 md:pt-8">
            <StatCarsComponent
              title="Active Users"
              value={userData?.total}
              changeValue={userData?.lastWeek}
              icon={<GoPeople className="w-6 h-6" />}
              trend={userData?.direction}
            />
            <StatCarsComponent
              title="Companies"
              value={companyData?.total}
              changeValue={10}
              icon={<GoOrganization className="w-6 h-6" />}
              trend={companyData?.direction}
            />
            <StatCarsComponent
              title="Job Listings"
              value={jobData?.total}
              changeValue={jobData?.lastWeek}
              icon={<GoBriefcase className="w-6 h-6" />}
              trend={jobData?.direction}
            />
          </div>

          {/* Charts */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-8 pt-8 pb-8">
            {/* Applicatoin  Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Application Response</h2>
                <button className="text-gray-500 hover:text-gray-700 transition-colors" title="Download Report">
                  <GoDownload className="w-5 h-5" onClick={handleWeeklyApplicationDownload} />
                </button>
              </div>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Applications"
                    />
                    <Line
                      type="monotone"
                      dataKey="interviews"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Accepted"
                    />
                    <Line
                      type="monotone"
                      dataKey="pending"
                      stroke="#009EDB"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Pending"
                    />
                    <Line
                      type="monotone"
                      dataKey="rejected"
                      stroke="#FF0000"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Rejected"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Subscription Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Subscription Revenue</h2>
                <button className="text-gray-500 hover:text-gray-700 transition-colors" title="Download Report">
                  <GoDownload className="w-5 h-5" onClick={handleRevenueDownload} />
                </button>
              </div>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECEBEB" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} fontSize={13} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                    <Bar
                      dataKey="subscription"
                      fill="#EB5B00"
                      radius={[5, 5, 0, 0]}
                      name="Subscription Revenue"
                      barSize={15}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;