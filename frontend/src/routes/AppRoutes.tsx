import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"
import { SocketProvider } from "../hooks/socket"
import ProtectedRoute from "../components/ProtectedRoute"
const Login = lazy(() => import("../pages/user/Login"))
const Home = lazy(() => import("../pages/user/Home"))
const Profile = lazy(() => import("../pages/user/Profile"))
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"))
const UserManageMent = lazy(() => import("../pages/admin/UserManageMent"))
const CompanyLogin = lazy(() => import("../pages/company/CompanyLogin"))
const ComapnyDashboard = lazy(() => import("../pages/company/CompanyDashboard"))
const CompanyProfile = lazy(() => import("../pages/company/CompanyProfile"))
const Notifications = lazy(() => import("../pages/user/Notifications"))
const AdminCompanyRequests = lazy(() => import("../pages/admin/AdminCompanyRequests"))
const CompanyJobListing = lazy(() => import("../pages/company/CompanyJobListing"))
const RequestPage = lazy(() => import("../pages/user/RequestPage"))
const JobLists = lazy(() => import("../pages/user/JobLists"))
const JobDetails = lazy(() => import("../pages/user/JobDetails"))
const CopmanyApplicants = lazy(() => import("../pages/company/CopmanyApplicants"))
const CompanyApplicantDetails = lazy(() => import("../pages/company/CompanyApplicantDetails"))
const MyJobs = lazy(() => import("../pages/user/MyJobs"))
const Subscription = lazy(() => import("../pages/user/Subscription"))
const PaymentSuccess = lazy(() => import("../pages/user/PaymentSuccess"))
const PaymentCancel = lazy(() => import("../pages/user/PaymentCancel"))
const CompanyManageMent = lazy(() => import("../pages/admin/CompanyManageMent"))
const SkillManagement = lazy(() => import("../pages/admin/SkillManagement"))
const SubscriptionHistory = lazy(() => import("../pages/user/SubscriptionHIstory"))
const SubscriptionHnadling = lazy(() => import("../pages/admin/SubscriptionHnadling"))
const Messages = lazy(() => import("../pages/user/Messages"))
const CompanyMessages = lazy(() => import("../pages/company/CompanyMessages"))
const VideoCall = lazy(() => import("../pages/user/VideoCall"))
const CompanyVideoCall = lazy(() => import("../pages/company/CompanyVideoCall"))
const CompanyScheduledMeeting = lazy(() => import("../pages/company/CompanyScheduledMeeting"))
const AboutUs = lazy(() => import("../pages/user/AboutUs"))
const Contact = lazy(() => import("../pages/user/Contact"))
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'



const AppRoutes = () => {

  return (
    <SocketProvider>
      <Router>
        <Suspense fallback={<div className="#bg-[#F6F6F6] flex justify-center items-center h-screen">
          <Bouncy size="45" speed="1.75" color="#FE4F00" />
        </div>}>
          <Routes>

            {/* public routes */}
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
            <Route path="/forgot-password" element={<Login />} />
            <Route path="/otp-verification" element={<Login />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/jobs" element={<JobLists />} />

            {/* user routes  protected routes */}

            <Route path="/profile" element={
              <ProtectedRoute >
                <Profile />
              </ProtectedRoute>
            } />

            <Route path="/success" element={
              <ProtectedRoute >
                <RequestPage />
              </ProtectedRoute>
            } />

            <Route path="/job-details/:id" element={
              <ProtectedRoute >
                <JobDetails />
              </ProtectedRoute>

            } />

            <Route path="/notifications" element={
              <ProtectedRoute >
                <Notifications />
              </ProtectedRoute>
            } />

            <Route path="/myjobs" element={
              <ProtectedRoute >
                <MyJobs />
              </ProtectedRoute>
            } />

            <Route path="/subscription" element={
              <ProtectedRoute >
                <Subscription />
              </ProtectedRoute>
            } />

            <Route path="/payment-success" element={
              <ProtectedRoute >
                <PaymentSuccess />
              </ProtectedRoute>
            } />

            <Route path="/payment-cancel" element={
              <ProtectedRoute >
                <PaymentCancel />
              </ProtectedRoute>
            } />

            <Route path="/subscription-history" element={
              <ProtectedRoute >
                <SubscriptionHistory />
              </ProtectedRoute>
            } />

            <Route path="/messages" element={
              <ProtectedRoute >
                <Messages />
              </ProtectedRoute>

            } />

            <Route path="/video" element={
              <ProtectedRoute >
                <VideoCall />
              </ProtectedRoute>
            } />



            {/* admin  routes*/}
            <Route path="/admin-dashboard" element={
              <ProtectedRoute adminOnly >
                <AdminDashboard />
              </ProtectedRoute>

            } />
            <Route path="/admin-users" element={
              <ProtectedRoute adminOnly >
                <UserManageMent />
              </ProtectedRoute>
            } />
            <Route path="/admin-companies" element={
              <ProtectedRoute adminOnly >
                <CompanyManageMent />
              </ProtectedRoute>
            } />
            <Route path="/admin-comapnyrequests" element={
              <ProtectedRoute adminOnly >
                <AdminCompanyRequests />
              </ProtectedRoute>
            } />

            <Route path="/admin-skillmanagement" element={
              <ProtectedRoute adminOnly >
                <SkillManagement />
              </ProtectedRoute>

            } />
            <Route path="/admin-subscriptions" element={
              <ProtectedRoute adminOnly >
                <SubscriptionHnadling />
              </ProtectedRoute>

            } />

            {/* company routes protected routes */}

            <Route path="/company-signup" element={
              <ProtectedRoute >
                <CompanyLogin />
              </ProtectedRoute>

            } />

            <Route path="/company-dashboard" element={
              <ProtectedRoute >
                <ComapnyDashboard />
              </ProtectedRoute>
            } />

            <Route path="/company-profile" element={
              <ProtectedRoute >
                <CompanyProfile />
              </ProtectedRoute>
            } />

            <Route path="/company-jobs" element={
              <ProtectedRoute >
                <CompanyJobListing />
              </ProtectedRoute>
            } />

            <Route path="/company-applicants/:jobId" element={
              <ProtectedRoute >
                <CopmanyApplicants />
              </ProtectedRoute>
            } />

            <Route path="company/applicants/:applicationId" element={
              <ProtectedRoute >
                <CompanyApplicantDetails />
              </ProtectedRoute>
            } />

            <Route path="/company-messages" element={
              <ProtectedRoute >
                <CompanyMessages />
              </ProtectedRoute>
            } />

            <Route path="/company-video" element={
              <ProtectedRoute >
                <CompanyVideoCall />
              </ProtectedRoute>

            } />

            <Route path="/company-scheduledmeeting" element={
              <ProtectedRoute>
                <CompanyScheduledMeeting />
              </ProtectedRoute>

            } />
          </Routes>
        </Suspense>
      </Router>
    </SocketProvider>
  )
}

export default AppRoutes