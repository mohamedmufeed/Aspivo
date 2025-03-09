
import React, { useState } from "react";
import { useEffect } from "react";
import { forgotPassword ,resendotp,resetPassword,verifyOtp} from "../../services/auth";
import { useNavigate } from "react-router-dom";


const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string>("")
  const[ emailError,setEmailError]=useState("")
  const [error, setError] = useState("")
  const [otp, setOtp] = useState("")
  const [otpError,setOtpError]=useState("")
  const [timer, setTimer] = useState(60)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1)
  const [resendbtn, setResendbtn] = useState(false)
  const navigate=useNavigate()

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setResendbtn(true)
    }

  }, [timer])


  const handleEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
 setEmailError("")
 setTimer(60)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
  setEmailError("Please enter a valid email address. *")
      return;
    }
    try {
      const response = await forgotPassword({ email })
      if(response){
        setStep(2)
      }
    } catch (error) {
      if(error instanceof Error){
        setEmailError(error.message)
       }else{
        setEmailError("Invalid email")
       }
    }
  }

  const handleOtp = async (e: React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault()
    setOtpError("")
    setTimer(60)
    if(!otp){
      setOtpError("Please Enter OTP")
      return
    }
      try {
        const data = await verifyOtp({ email, otp })
        if (data && data.user.user && data.user.user.verified) {
            setStep(3)
        } else {
           throw new Error("Invalid OTP ");
        }
      } catch (error) {
        setOtpError(` Invalid OTP${error}`)
       }

  }

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!newPassword || !passwordPattern.test(newPassword)) {
      setError('Password must include uppercase, lowercase, number, special character, and 8+ characters.');
      return;
    }
     if(newPassword != confirmPassword){
      setError("Password does not match")
      return 
     }

    try {
      const response = await resetPassword ({email,newPassword})
      if(response){
        navigate("/")
      }
    } catch (error) {
      setError("Something Went Wrong")
    }
  }

   const handleResendOtp = async (e:React.FormEvent<HTMLSpanElement>)=>{
    e.preventDefault()
    try {
      await resendotp({email})
      setTimer(60)
      setResendbtn(false)
      setError("")
      setOtpError("")
      setEmailError("")
      
    } catch (error) {
      setError(" Error in resending  Otp")
    }
   }

  return (

    <div className="  bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] h-full p-8">

      {step === 1 && (
        <div>
          <form action="" onSubmit={handleEmail}>
          
            <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Reset Password</h1>
            <p className="text-gray-500 mb-6">Enter your email to receive an OTP</p>
            <div className="w-full flex flex-col space-y-3 ">
              <label className="text-gray-700 font-medium">Email</label>
              {emailError ? <p className="text-red-600 font-light text-sm ">{emailError}</p> : ""}
              <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Enter your email" />
            </div>
            <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">
              <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Send</button>
            </div>
            <p className="mt-4 text-center text-black">
              Don't have an account? <span className="text-orange-600 cursor-pointer hover:underline" >Sign up</span>
            </p>
          </form>
        </div>
      )}

      {step === 2 && (
        <div>
          <form action="" onSubmit={handleOtp}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Enter The OTP </h1>
            <p className="text-gray-500 text-sm  mb-6">A 6-digit code has been sent to <b className="text-black">{email}</b></p>
            <p className="flex justify-center text-orange-500">{timer > 0 ? `OTP expires in ${timer}s` : "OTP expired!"}</p>
            <div className="w-full flex flex-col space-y-3 ">
              <label className="text-gray-700 font-medium">OTP</label>
              {otpError ? <p className="text-red-600 font-light text-sm ">{otpError}</p> : ""}
              <input onChange={(e) => setOtp(e.target.value)} value={otp} type="text" className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Enter your OTP"  disabled={timer === 0}/>
            </div>
            <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">
              <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition" disabled={timer === 0}>Verify</button>
            </div>
            <p className="mt-6 text-center text-black">
              i didn't Receive Otp ?
              {resendbtn ? (<span className="text-orange-600 cursor-pointer hover:underline" onClick={handleResendOtp}  >Resend OTP</span>) :
                (<span className="text-orange-200 cursor-pointer hover:underline disabled:"  >Resend OTP </span>)
              }


            </p>
          </form>
        </div>
      )}

      {step === 3 && (
        <div>
          <form action="" onSubmit={handleSubmit} >
 
            <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Create New Password </h1>
            <p className="text-gray-500 text-sm  mb-6">Enter the new password</p>
            <div className="w-full flex flex-col space-y-3 ">
              <label className="text-gray-700 font-medium">New Password</label>
              {error ? <p className="text-red-600 font-light text-sm ">{error}</p> : ""}
              <input onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type="password" className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Enter your New password" />
              <label className="text-gray-700 font-medium">Confirm Password </label>
              <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Confirm your  password" />
            </div>
            <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">
              <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">Change</button>
            </div>
            <p className="mt-4 text-center text-black">
              Don't have an account? <span className="text-orange-600 cursor-pointer hover:underline" >Sign up</span>
            </p>
          </form>
        </div>
      )}


    </div>
  )
}

export default ForgotPasswordForm