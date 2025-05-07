import { IoChevronBackOutline } from "react-icons/io5"
import Navbar from "../../components/homecomponts/Navbar"
import { useNavigate } from "react-router-dom"
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { FaXTwitter } from "react-icons/fa6";





const Contact = () => {
  const navigate = useNavigate()
  return (
    <div>
      <Navbar />
      <div className="bg-[#F6F6F6] h-full ">

        <div className="flex px-5 sm:px-10 pt-10 text-center space-x-5">
          <IoChevronBackOutline
            className="w-8 h-8 sm:w-8 sm:h-8  sm:ml-3 mr-3 sm:mr-6 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <h1 className="text-2xl sm:text-3xl font-medium">Contact Us</h1>
        </div>

        <div className="sm:flex px-7 sm:px-27 pt-18 ">
          <div className="sm:w-1/2">
            <h1 className="text-4xl font-medium">Get in Touch</h1>
            <p className="pt-5 text-base/relaxed">We’re here to help! Whether you have questions about job listings, need assistance with your applications, or want to share your feedback, feel free to reach out. Our team is always ready to assist job seekers and employers to ensure a smooth experience on <span className="text-orange-600">Aspivo</span> </p>
            <div className="pt-10">
              <h1 className="font-semibold text-xl">Address</h1>
              <p className="text-sm text-gray-700">London UK, Londen eye</p>
            </div>
            <div className="pt-5" >
              <h1 className="font-semibold text-xl">Phone Number</h1>
              <p className="text-sm text-gray-700">+91 9876543210</p>
            </div>
            <div className="pt-5">
              <h1 className="font-semibold text-xl">E- mail</h1>
              <p className="text-sm text-gray-700">aspivo@gmail.com</p>
            </div>
            <div className="pt-10">
              <div className="h-px  bg-gray-400 w-full" />
            </div>

            <div className="pt-10 flex space-x-3">
              <h1 className="text-2xl">Follow Us :</h1>
              <div className="flex space-x-3    items-center">
                <FaInstagram className="w-5 h-5" />
                <FaLinkedin className="w-5 h-5" />
                <HiOutlineMail className="w-5 h-5" />
                <FaXTwitter className="w-5 h-5" />
              </div>

            </div>
          </div>
          <div className="sm:w-1/2 px-1 sm:px-15 pt-10 s:pt-0 pb-20">
            <div className="bg-white p-10 sm:p-15 sm:px-10 rounded-xl pt-10 shadow-lg ">
              <h1 className=" text-2xl sm:text-3xl font-semibold">Send a Message</h1>
              <div className="grid pt-10 space-y-13">
                <input placeholder="Name"   className="border-b border-gray-400 outline-none focus:ring-0" type="text" />

                <input placeholder="Email"   className="border-b border-gray-400 outline-none focus:ring-0" type="email" />

                <textarea placeholder="Message"   className="border-b border-gray-400 outline-none focus:ring-0" name="" id=""></textarea>

              </div>
              <p className="text-sm text-gray-700 pt-7" >By Submitting, you agree to the processing of your personal data by Subx as described in the Privacy Statement.</p>
              <div className="flex justify-end pt-5">
                <button className="bg-orange-600 p-3 px-4 rounded-lg text-white font-bold">Submit</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Contact