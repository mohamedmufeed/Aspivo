import { signup as signupApi } from "../../services/auth";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export interface NewUser {
  id?: string;
  userName: string;
  email: string;
  password: string;
}

const SignupForm = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [userName, setUserName] = useState<string>("")
  const [userNameError, setUserNameError] = useState("")
  const [email, setEmail] = useState<string>("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState<string>("")
  const [passwordError, setPasswordError] = useState("")
  const [lodaing, setLoading] =useState(false)


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUserNameError("")
    setEmailError("");
    setPasswordError("");
    setError("");
 if(!userName && ! email&& !password){
  setError("All fields are required")
  return
 }

    if(userName.length<3){
      setUserNameError("Username must be at least 3 characters long")
      return ;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address. *");
      return;
    }
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password || !passwordPattern.test(password)) {
      setPasswordError('Password must include uppercase, lowercase, number, special character, and 8+ characters.');
      return;
    }

    try {
      setLoading(true)
      const data = await signupApi({ userName, email, password })
      if (data) {
        navigate("/otp-verification", { state: { email } });
    } else {
        setError("Signup failed, please try again.");
    }
    } catch (error) {

      console.log("the errorr",error)
      if(error instanceof Error){
       setError(error.message)
      }else{
       setError("Invalid username and password")
      }

    }finally{
      setLoading(true)
    }
  }

  return (
    <div className="  bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] h-full p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Create an account</h1>
      <p className="text-gray-500 mb-6">Join us by filling in your details</p>
      {error ?<p className="text-red-600 font-light text-sm ">{error}</p>:""}
      <form action="" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col space-y-3 ">
       
          <label htmlFor="userName" className="text-gray-700 font-medium">UserName</label>
          {userNameError ? <p className="text-red-600 font-light text-sm  ">{userNameError}</p> : ""}
          <input onChange={(e) => setUserName(e.target.value)} type="text" name="userName" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your UserName" />
         
          <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
          {emailError ? <p className="text-red-600 font-light text-sm  ">{emailError}</p> : ""}
          <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your email" />
         
          <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
          {passwordError ? <p className="text-red-600 font-light text-sm  ">{passwordError}</p> : ""}
          <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your password" />


        </div>


        <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">

          <button className=" w-full sm:w-35 h-12 py-3  bg-white border rounded-lg flex items-center justify-center space-x-2">
            <FcGoogle className="w-7 h-7" />

            <span className="font-bold">Google</span>
          </button>

          <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">{lodaing?"Loding ...":"Sign Up"}</button>
        </div>

      </form>
     

      <p className="mt-4 text-center text-black">
        Already Account ? <span className="text-orange-600 cursor-pointer hover:underline" >
          <Link to={"/login"}>        Login
          </Link>

        </span>
      </p>
    </div>
  )
}

export default SignupForm