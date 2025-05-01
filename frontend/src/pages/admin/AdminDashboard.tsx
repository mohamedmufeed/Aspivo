import { useEffect, useState } from "react";
import Sidebar from "../../components/Admin/Sidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import { GoPeople, GoOrganization, GoBriefcase, GoDownload, GoCalendar } from "react-icons/go";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import StatCarsComponent from "../../components/Admin/StatCarsComponent";
import { getDashboardStats } from "../../services/adminService";

export interface IState{
  diff:number;
  direction:string;
  lastWeek:number;
  percentage:string;
  total:number
}
const AdminDashboard = () => {
  const [selected, setSelectedMenu] = useState("Dashboard");
  const [userData,setUserData]=useState<IState>()
  const [companyData,setCompanyData]=useState<IState>()
  const [jobData,setJobData]=useState<IState>()
  const [dateRange, setDateRange] = useState("Feb 20 - Feb 26");

  const applicationData = [
    { name: "Mon", applications: 25, interviews: 10 },
    { name: "Tue", applications: 35, interviews: 15 },
    { name: "Wed", applications: 45, interviews: 20 },
    { name: "Thu", applications: 30, interviews: 12 },
    { name: "Fri", applications: 50, interviews: 25 },
    { name: "Sat", applications: 20, interviews: 8 },
    { name: "Sun", applications: 15, interviews: 5 },
  ];

  const revenueData = [
    { name: "Jan", subscription: 5000 },
    { name: "Feb", subscription: 6200 },
    { name: "Mar", subscription: 7800 },
    { name: "Apr", subscription: 8500 },
    { name: "May", subscription: 9200 },
    { name: "Jun", subscription: 9800 },
  ];

  useEffect(()=>{
    const fetchDashbordStats=async()=>{
      try {
        const response=  await getDashboardStats()
        setUserData(response.users)
        setCompanyData(response.companies)
        setJobData(response.jobs)
        console.log(response)
      } catch (error) {
        console.error("Error fetching on dashbord stats");
        
      }
    }
    fetchDashbordStats()
  },[])

  const userDataa = {
    name: "John Doe",
    role: "Admin",
    users: 876,
    companies: 234,
    jobs: 567,
    newUsers: 25,
    newCompanies: 12,
    newJobs: 34,
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <Sidebar setSelected={setSelectedMenu} />
        <div className="bg-gray-50 w-full overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>
          <AdminHeader heading="Dashboard" />

          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:justify-between px-4 md:px-8 pt-6 md:pt-10">
            <div className="space-y-2 mb-4 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                Good Morning
              </h1>
              <p className="text-md font-normal text-gray-600">
                Here's your admin dashboard overview for today
              </p>
            </div>
            <div className="border rounded-lg shadow-sm  flex items-center px-3 h-12 self-start">
              <GoCalendar className="text-gray-500 mr-2" />
              <select
                className="bg-transparent focus:outline-none py-2 text-gray-700 cursor-pointer"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="Feb 20 - Feb 26">Feb 20 - Feb 26</option>
                <option value="Feb 27 - Mar 5">Feb 27 - Mar 5</option>
                <option value="Mar 6 - Mar 12">Mar 6 - Mar 12</option>
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
              changeValue={companyData?.lastWeek}
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Application Response</h2>
                <button className="text-gray-500 hover:text-gray-700 transition-colors" title="Download Report">
                  <GoDownload className="w-5 h-5" />
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
                      name="Interviews"
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
                  <GoDownload className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Bar 
                      dataKey="subscription" 
                      fill="#EB5B00" 
                      radius={[5, 5, 0, 0]} 
                      name="Subscription Revenue" 
                      barSize={40}
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