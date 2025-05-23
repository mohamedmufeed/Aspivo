
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoCloudUploadOutline } from 'react-icons/io5'
import { signup } from "../../../services/company/auth";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { register } from "../../../redux/slice/comapnyAuthSlice";



export interface NewUser {
  id?: string;
  userName: string;
  email: string;
  password: string;
}

const CompanySignupForm = () => {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const [companyName, setCompanyName] = useState<string>("")
  const [companyNameError, setCompanyNameError] = useState("")
  const [email, setEmail] = useState<string>("")
  const [kyc, setKyc] = useState<File | null>(null)
  const [kycUrl, setKycUrl] = useState("")
  const [emailError, setEmailError] = useState("")
  const [kycError, setKycError] = useState("")
  const [uploading, setUploading] = useState(false)

const dispatch=useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.auth.user)
  const userId = user?._id || "";
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "Aspivo")
    try {
      setUploading(true);
      const { data } = await axios.post("https://api.cloudinary.com/v1_1/do4wdvbcy/upload", formData)
      setUploading(false)
      return data.secure_url
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }
  }

  const handleKyc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const uploadedkycUrl = await uploadToCloudinary(file)
      const afterUpload = uploadedkycUrl.slice(uploadedkycUrl.indexOf("upload/") + 7);
      setKyc(file)
      if (uploadedkycUrl) {
        setKycUrl(afterUpload)
      }
    }
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setCompanyNameError("")
    setEmailError("");
    setError("");
    if (!companyName && !email ) {
      setError("All fields are required")
      return
    }

    if (companyName.length < 3) {
      setCompanyNameError("Username must be at least 3 characters long")
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address. *");
      return;
    }
   
    if (!kyc) {
      setKycError("KYC is required")
    }

    try {
      const response = await signup(companyName,email,   kycUrl, userId)
      dispatch(register({
        company: {
          _id: response._id,
          companyName: response.companyName,
          email: response.email,
          logo: response.kyc, 
        },
        token: response.token
      }));
      if (response) {
        navigate("/company-dashboard");
    } else {
        setError("Signup failed, please try again.");
    }
      return response
    } catch (error) {
      setError("Somthing Went wrong Please try later")
      console.error("Error submitting resume:", error);
    }


  }





  return (
    <div className="  bg-[#F6F6F6] flex flex-col justify-center font-[Montserrat] h-full p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2 mt-10">Register Company</h1>
      {error ? <p className="text-red-600 font-light text-sm ">{error}</p> : ""}
      <form action="" onSubmit={handleSubmit}>
        <div className="w-full flex flex-col mt-2 space-y-3 ">

          <label htmlFor="companyname" className="text-gray-700 font-medium">Comapny Name</label>
          {companyNameError ? <p className="text-red-600 font-light text-sm  ">{companyNameError}</p> : ""}
          <input onChange={(e) => setCompanyName(e.target.value)} type="text" name="userName" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your comapny name" />

          <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
          {emailError ? <p className="text-red-600 font-light text-sm  ">{emailError}</p> : ""}
          <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" className={`w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500  ${emailError ? "border-red-500" : ""}`} placeholder="Enter your comapny email" />


          <div className="w-full" >
            <label htmlFor="kyc" className="text-gray-700 font-medium">
              Upload KYC
            </label>
            {kycError ? (
              <p className="text-red-600 font-light text-sm">{kycError}</p>
            ) : null}


            <div className="relative w-full">
              <input type="file" onChange={handleKyc} id="kyc" name="kyc" className="absolute opacity-0 w-full h-full cursor-pointer" />
              <label htmlFor="kyc" className={`w-full p-3 border rounded-md flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer ${kycError ? 'border-red-500' : 'border-gray-900'}`} >
                <span className="text-gray-500">
                  {kyc ? kyc.name : 'Choose a file to upload'}
                </span>
                <IoCloudUploadOutline className="text-orange-500 w-5 h-5" />
              </label>
            </div>
          </div>

        </div>


        <div className="w-full  flex felx-col md:flex-row justify-center gap-7  sm:gap-4 space-y-4 sm:space-y-0 mt-6">
          <button type="submit" className=" w-full sm:w-35  h-12 font-bold py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition" disabled={uploading===true}>{uploading?"Uploading ..":"Register"}</button>
        </div>

      </form>
      <p className="text-center pt-10">Not now -<span className="text-orange-600"> <Link to={"/"}> Back to Home</Link></span></p>


    </div>
  )
}

export default CompanySignupForm