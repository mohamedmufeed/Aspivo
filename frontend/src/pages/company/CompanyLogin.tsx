
import { motion } from "framer-motion"
import image1 from "../../assets/company image 1.jpeg"
import image2 from "../../assets/company image 2.jpg"
import image3 from "../../assets/company image 3.jpg"
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { lazy,Suspense } from "react";

const SignupForm= lazy(()=>import("../../components/Company/Authforms/ComapnyRegister"))
const ForgotPasswordForm =lazy(()=>import("../../components/AuthForms/ForgotPasswordForm"))



const imageSlide = [
  {
    image: image1,
    text: "Finding the right talent, building successful career paths"
  },
  {
    image: image2,
    text: "Connecting job seekers with the best opportunities"
  },
  {
    image: image3,
    text: "Helping businesses hire efficiently and effectively",
  }
]


const CompanyLogin = () => {

  const [currentIndex, setCurrentIndex] = useState(0)
  const location = useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageSlide.length)
    }, 3000);


    return () => {
      clearInterval(interval)

    }
  }, [])

  const renderForm = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {location.pathname === "/company-signup" ? (
          <SignupForm />
        ) : location.pathname === "/forgot-password" ? (
          <ForgotPasswordForm />
        ) : location.pathname === "/company-verification" ? (
          <OtpVerification />
        ) : (
          <SignupForm />
        )}
      </Suspense>
    );
  };
  


  return (
    <div className="bg-white flex justify-center items-center min-h-screen p-4">
      {/* login  image section */}
      <div className="flex flex-col  md:flex-row   items-center justify-center w-[1050px] h-[650px] shadow-lg rounded-lg overflow-hidden">

        <div className=" hidden md:flex w-1/2 flex-col items-center justify-center p-8">

          <div className="text-[30px] ps-8 mb-10 font-bold flex items-center font-[Montserrat]">
            <span className="w-9 h-10 md:w-9 md:h-10 bg-orange-600 text-white rounded-lg font-extrabold flex items-center justify-center mr-1">A</span>
            spivo
          </div>

          <motion.img
            key={currentIndex}
            src={imageSlide[currentIndex].image}
            alt="Office Work"
            className="w-fit h-80 object-cover rounded-lg"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
          />


          <motion.p
            key={currentIndex + "-text"}
            className="font-[Montserrat] text-center text-[#7F7F7F] mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
          >
            {imageSlide[currentIndex].text}
          </motion.p>

          <div className="flex space-x-2 mt-4">
            {imageSlide.map((_, index) => (
              <span
                key={index}
                className={`w-5 h-1.5 rounded ${index === currentIndex ? "bg-orange-600 w-8" : "bg-orange-200"
                  }`}
              ></span>
            ))}
          </div>

        </div>

        {/* login form section */}
        <div className="w-full h-full md:w-1/2">
          {renderForm()}
        </div>
      </div>
    </div>
  );
};

export default CompanyLogin;
