import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { lazy,Suspense } from "react"
const Login= lazy(()=>import("../pages/Login"))
const Home =lazy(()=>import("../pages/Home"))
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
      </Routes>
      </Suspense>
    </Router>
  )
}

export default UserRoutes