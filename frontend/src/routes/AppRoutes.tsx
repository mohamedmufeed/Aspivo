import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy,Suspense } from "react"
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


const AppRoutes = () => {
  return (
    <Router>
      <Suspense fallback={<div>Loding</div>}> 
      <Routes>
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
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<UserManageMent />} />
        <Route path="/admin-companies" element={<CompanyManageMent />} />
        <Route path="/admin-comapnyrequests" element={<AdminCompanyRequests />} />
        <Route path="/company-signup" element={<CompanyLogin />} />
        <Route path="/company-dashboard" element={<ComapnyDashboard />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/company-jobs" element={<CompanyJobListing />} />
        <Route path="/company-applicants/:jobId" element={<CopmanyApplicants />} />
        <Route path="company/applicants/:applicationId" element={<CompanyApplicantDetails />} />
      </Routes>
      </Suspense>
    </Router>
  )
}

export default AppRoutes