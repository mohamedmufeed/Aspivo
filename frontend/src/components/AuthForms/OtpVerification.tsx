import React, { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { resendotp, verifyOtp } from "../../services/auth"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store/store"
import { login } from "../../redux/slice/authSlice"




const OtpVerification = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<AppDispatch>()
    const email = location.state?.email || ""
    const [error, setError] = useState("")
    const [otp, setOtp] = useState<string>("")

    const [timer, setTimer] = useState(60)
    const [resendbtn, setResendbtn] = useState(false)

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

    const handleOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const data = await verifyOtp({ email, otp })
            console.log(" the data  from verify otp", data.user.user)
            if (data.user.user) {
                dispatch(login({
                    _id: data.user.user._id,
                    userName: data.user.user.userName,
                    email: data.user.user.email,
                    isAdmin: data.user.user.isAdmin || false
                }));
                 navigate("/");
            } else {
                throw new Error("Invalid OTP ");
            }
        } catch (error) {
            console.log("error on sending otp",error)
            setError("Invalid  Otp")
        }
    }

    const handleResendOtp = async () => {
        setTimer(60)
        setResendbtn(false)
        setError("")
        try {
            const response = await resendotp({ email })
            console.log(response)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("OTP varification failed")
            }
        }
    }

    return (
        <div className="  bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] h-full p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Verifying Email</h1>
            <p className="text-gray-500 text-sm  mb-6">A 6-digit code has been sent to <b className="text-black">{email}</b></p>
            <p className="flex justify-center text-orange-500">{timer > 0 ? `OTP expires in ${timer}s` : "OTP expired!"}</p>

            <form action="" onSubmit={handleOtp}  >
                {error ? <p className="text-red-600 font-light text-sm ">{error}</p> : ""}
                <div className="w-full flex flex-col space-y-3 ">
                    <label htmlFor="otp" className="text-gray-700 font-medium">Otp</label>
                    <input type="text" onChange={(e) => setOtp(e.target.value)} name="otp" id="otp" className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500" placeholder="Enter your OTP" disabled={timer === 0} />
                </div>
                <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">
                    <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition" disabled={timer === 0}>Verfiy Otp</button>
                </div>
            </form>

            <p className="mt-6 text-center text-black">
                i didn't Receive Otp ?
                {resendbtn ? (<span className="text-orange-600 cursor-pointer hover:underline" onClick={handleResendOtp} >Resend OTP</span>) :
                    (<span className="text-orange-200 cursor-pointer hover:underline" >Resend OTP </span>)
                }


            </p>
        </div>
    )
}

export default OtpVerification