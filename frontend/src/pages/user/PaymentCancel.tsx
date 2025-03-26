import React from 'react'
import failedGif from "../../assets/Bug fixing.gif"
import { useNavigate } from 'react-router-dom'


const PaymentCancel = () => {
    const navigate=useNavigate()
  return (
    <div className="bg-[#F6F6F6] h-screen flex justify-center items-center font-dm-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
        <img src={failedGif} className="w-70 h-70 mx-auto" alt="Payment Failed" />

        <h1 className="text-2xl font-bold mt-6 ">Payment Failed</h1>
        <p className="text-gray-600 mt-4">
          Unfortunately, your transaction could not be completed. Please try again or contact support if the issue persists.
        </p>

        <button
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg mt-6 transition duration-300 cursor-pointer"
          onClick={()=>navigate("/")}
        >
          Go to Home
        </button>
        <p className='p-3'>Nedd help ? <span className='text-orange-600 cursor-pointer'>aspivo@gmail.com</span></p>
      </div>

 
    </div>
  )
}

export default PaymentCancel
