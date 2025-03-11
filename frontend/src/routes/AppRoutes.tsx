import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy,Suspense } from "react"
const Login= lazy(()=>import("../pages/user/Login"))
const Home =lazy(()=>import("../pages/user/Home"))
const Profile= lazy(()=>import("../pages/user/Profile"))
const AdminDashboard= lazy(()=>import("../pages/admin/AdminDashboard"))
const UserManageMent=lazy(()=>import("../pages/admin/UserManageMent"))
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
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-users" element={<UserManageMent />} />
      </Routes>
      </Suspense>
    </Router>
  )
}

export default AppRoutes