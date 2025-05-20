
import { motion } from "framer-motion"
import image1 from "../../assets/image1.jpg"
import image2 from "../../assets/image2.jpg"
import image3 from "../../assets/image3.jpg"
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { lazy,Suspense } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
const LoginForm = lazy(()=>import("../../components/AuthForms/LoginForm"))
const SignupForm= lazy(()=>import("../../components/AuthForms/SignupForm"))
const ForgotPasswordForm =lazy(()=>import("../../components/AuthForms/ForgotPasswordForm"))
const OtpVerification =lazy(()=>import("../../components/AuthForms/OtpVerification"))



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


const Login = () => {

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

  
  const naviagte = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => {
    if (user) {
      naviagte("/")
    } 
  }, [naviagte, user])



  const renderForm = () => {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        {location.pathname === "/signup" ? (
          <SignupForm />
        ) : location.pathname === "/forgot-password" ? (
          <ForgotPasswordForm />
        ) : location.pathname === "/otp-verification" ? (
          <OtpVerification />
        ) : (
          <LoginForm />
        )}
      </Suspense>
    );
  };
  


  return (
    <div className="bg-white flex justify-center items-center min-h-screen p-4">
      {/* login  image section */}
      <div className="flex flex-col  md:flex-row   items-center justify-center w-[1050px] h-[650px] shadow-lg rounded-lg overflow-hidden">

        <div className=" hidden md:flex w-1/2 flex-col items-center justify-center p-8">

          <div className="text-[30px] ps-8 mb-10 font-bold flex items-center font-[Montserrat]" onClick={()=>naviagte("/")}>
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

          <div className="flex space-x-2 mt-10">
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

export default Login;
