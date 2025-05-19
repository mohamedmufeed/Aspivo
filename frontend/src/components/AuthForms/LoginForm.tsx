import React, {  useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {  AppDispatch } from "../../redux/store/store";
import { useDispatch } from "react-redux";
import { login as loginApi } from "../../services/auth";
import { login } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { googleLogin } from "../../services/auth";
import { registerUserSocket } from "../../services/socket";
const LoginForm = () => {
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState("")
  const [loading,setloading]=useState(false)
  const [error, setError] = useState("")
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()  
  const handeleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setEmailError("")
    setPasswordError("")

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address. *");
      return;
    }
    if (!password || password.length < 4) {
      setPasswordError('Password must be at least 6 characters *');
      return;
    }


    try {

      const data = await loginApi({ email, password })
      dispatch(login(data.user))
      registerUserSocket("user", data.user.id);
      setloading(true)
      if (data && data.user.isAdmin) {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Invalid username and password")
      }

    }
  }

  

  return (

    <div className="  bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] h-full p-8">

      <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Welcome Back</h1>
      <p className="text-gray-500 mb-6">Welcome Back ! Please enter your details</p>

      <form action="" onSubmit={handeleSubmit} >
        {error ? <p className="text-red-600 font-light text-sm ">{error}</p> : ""}
        <div className="w-full flex flex-col space-y-3 ">
          <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
          {emailError ? <p className="text-red-600 font-light text-sm  ">{emailError}</p> : ""}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your email" />

          <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
          {passwordError ? <p className="text-red-600 font-light text-sm ">{passwordError}</p> : ""}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} name="password" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${passwordError ? "border-red-500" : ""}`} placeholder="Enter your password" />

          <p className="text-right font-medium text-black text-sm cursor-pointer hover:underline mt-2" > <Link to={"/forgot-password"}> Forgot Password ?</Link></p>
        </div>


        <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">

          <button type="button" onClick={()=>googleLogin()} className=" w-full sm:w-35 h-12 py-3  bg-white border rounded-lg flex items-center justify-center space-x-2">
            <FcGoogle className="w-7 h-7" />

            <span className="font-bold">Google</span>
          </button>

          <button  type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"> {loading?"Loding":"Login"}</button>
        </div>
      </form>

      <p className="mt-4 text-center text-black">
        Don't have an account? <span className="text-orange-600 cursor-pointer hover:underline" ><Link to={"/signup"}>Sign up</Link></span>
      </p>

    </div>
  )
}

export default LoginForm