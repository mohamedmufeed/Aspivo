import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy,Suspense } from "react"
import { SocketProvider } from "../hooks/socket"
const Login= lazy(()=>import("../pages/user/Login"))
const Home =lazy(()=>import("../pages/user/Home"))
const Profile= lazy(()=>import("../pages/user/Profile"))
const AdminDashboard= lazy(()=>import("../pages/admin/AdminDashboard"))
const UserManageMent=lazy(()=>import("../pages/admin/UserManageMent"))
const CompanyLogin=lazy(()=>import("../pages/company/CompanyLogin"))
const ComapnyDashboard=lazy(()=>import("../pages/company/CompanyDashboard"))
const CompanyProfile=lazy(()=> import("../pages/company/CompanyProfile"))
const Notifications=lazy(()=>import("../pages/user/Notifications"))
const AdminCompanyRequests=lazy(()=>import("../pages/admin/AdminCompanyRequests"))
const CompanyJobListing=lazy(()=>import("../pages/company/CompanyJobListing"))
const RequestPage= lazy(()=>import("../pages/user/RequestPage"))
const JobLists=lazy(()=>import("../pages/user/JobLists"))
const JobDetails=lazy(()=>import("../pages/user/JobDetails"))
const CopmanyApplicants=lazy(()=>import("../pages/company/CopmanyApplicants"))
const CompanyApplicantDetails=lazy(()=>import("../pages/company/CompanyApplicantDetails"))
const MyJobs=lazy(()=>import("../pages/user/MyJobs"))
const Subscription=lazy(()=>import("../pages/user/Subscription"))
const PaymentSuccess=lazy(()=>import("../pages/user/PaymentSuccess"))
const PaymentCancel=lazy(()=>import("../pages/user/PaymentCancel"))
const CompanyManageMent=lazy(()=>import("../pages/admin/CompanyManageMent"))
const SkillManagement=lazy(()=>import("../pages/admin/SkillManagement"))
const SubscriptionHistory=lazy(()=>import("../pages/user/SubscriptionHIstory"))
const SubscriptionHnadling=lazy(()=>import("../pages/admin/SubscriptionHnadling"))
const Messages=lazy(()=>import("../pages/user/Messages"))
const CompanyMessages=lazy(()=>import("../pages/company/CompanyMessages"))
const VideoCall=lazy(()=>import("../pages/user/VideoCall"))
const CompanyVideoCall=lazy(()=>import("../pages/company/CompanyVideoCall"))
const CompanyScheduledMeeting=lazy(()=>import("../pages/company/CompanyScheduledMeeting"))
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

const AppRoutes = () => {
  return (
    <SocketProvider> 
    <Router>
      <Suspense fallback={        <div className="#bg-[#F6F6F6] flex justify-center items-center h-screen">
                <Bouncy size="45" speed="1.75" color="#FE4F00" />
            </div>}> 
      <Routes>
        {/* user routes */}
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="/forgot-password" element={<Login />} />
        <Route path="/otp-verification" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<RequestPage />} />
        <Route path="/jobs" element={<JobLists />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/myjobs" element={<MyJobs />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/subscription-history" element={<SubscriptionHistory />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/video" element={<VideoCall />} />
    

        {/* admin  routes*/}
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<UserManageMent />} />
        <Route path="/admin-companies" element={<CompanyManageMent />} />
        <Route path="/admin-comapnyrequests" element={<AdminCompanyRequests />} />
        <Route path="/admin-skillmanagement" element={<SkillManagement />} />
        <Route path="/admin-subscriptions" element={<SubscriptionHnadling />} />

        {/* company routes */}
        <Route path="/company-signup" element={<CompanyLogin />} />
        <Route path="/company-dashboard" element={<ComapnyDashboard />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/company-jobs" element={<CompanyJobListing />} />
        <Route path="/company-applicants/:jobId" element={<CopmanyApplicants />} />
        <Route path="company/applicants/:applicationId" element={<CompanyApplicantDetails />} />
        <Route path="/company-messages" element={<CompanyMessages />} />
        <Route path="/company-video" element={<CompanyVideoCall />} />
        <Route path="/company-scheduledmeeting" element={<CompanyScheduledMeeting />} />
      </Routes>
      </Suspense>
    </Router>
    </SocketProvider>
  )
}

export default AppRoutes