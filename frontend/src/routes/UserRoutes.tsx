import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy,Suspense } from "react"
const Login= lazy(()=>import("../pages/user/Login"))
const Home =lazy(()=>import("../pages/user/Home"))
const Profile= lazy(()=>import("../pages/user/Profile"))
const UserRoutes = () => {
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
      </Routes>
      </Suspense>
    </Router>
  )
}

export default UserRoutes