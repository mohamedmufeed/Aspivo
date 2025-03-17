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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<UserManageMent />} />
        <Route path="/admin-comapnyrequests" element={<AdminCompanyRequests />} />
        <Route path="/company-signup" element={<CompanyLogin />} />
        <Route path="/company-dashboard" element={<ComapnyDashboard />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
      </Routes>
      </Suspense>
    </Router>
  )
}

export default AppRoutes