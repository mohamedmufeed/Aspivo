import bannerImage from "../../assets/job-interview-concept-illustration.png"
import { IoIosSearch } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaMeta } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa";
import Category from "../../components/homecomponts/Category";
import Navbar from "../../components/homecomponts/Navbar";
import JobCollections from "../../components/homecomponts/JobCollections";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {

  const jobs = [
    {
      title: "Software Developer",
      company: "Google Developer",
      experience: "Min 2+ Work Exp | Conditions",
      icon: <FaGoogle />,
    },
    {
      title: "UI UX Designer",
      company: "Meta Designer",
      experience: "Min 3+ Work Exp | Conditions",
      icon: <FaMeta />,
    },
    {
      title: "Product Designer",
      company: "Airbnb",
      experience: "Min 2+ Work Exp | Conditions",
      icon: <FaAirbnb />
      ,
    },
  ];

  const naviagte = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  useEffect(() => {
    if (user) {
      naviagte("/")
    } else {
      naviagte("/login")
    }
  }, [naviagte, user])


  return (
    <>
      <Navbar />
      <section className="flex h-screen  bg-[#F6F6F6]" style={{ fontFamily: "DM Sans, sans-serif" }}>
        {/*content Sction */}
        <div className="mt-5">
          <h1 className="font-[Montserrat] font-semibold text-7xl  ps-24  mt-36">Find Your <br /> Dream Job Here <br /> In one Place</h1>
          <p className="ps-24 mt-8   font-extralight " >Explore thousands of job opportunities Find the perfect <br /> role that suits you.</p>

          {/*serach bar*/}
          <div className="bg-white w-96  ml-24 mt-8  h-16 rounded-lg shadow-lg">
            <form className=" " action="">
              <div className="flex ">
                <label htmlFor="serach" className="text-[#837F7F] whitespace-nowrap   p-5  ml-auto  font-extralight" >Job title or Keyword | Location</label>
                <button className="w-20 h-14  ml-auto mt-1  mr-1  flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer ">
                  <IoIosSearch className="w-6  h-12 " />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/*image Section */}
        <div className="">
          <div className="p-5  ml-50 mt-20" >
            <img className="w-96 h-96" src={bannerImage} alt="banner image" />
          </div>
          {/* jobBox */}
          <div className="bg-black/5 backdrop-blur-md border absolute -mt-35 ml-40 border-white/30 rounded-2xl shadow-white-lg w-80  ps-4 h-80">
            <h1 className="font-bold p-4 text-xl flex">Find Job <IoMdArrowDropdown className="mt-1 " /> </h1>
            <hr />
            <div className="space-y-4 p-3">
              {jobs.map((job, index) => (
                <div key={index} className="flex items-center gap-4">

                  <div className="w-12 h-12 flex items-center justify-center bg-black text-white rounded-full text-2xl font-bold">
                    {job.icon}
                  </div>


                  <div>
                    <h2 className="text-lg font-semibold ">{job.title}</h2>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-xs text-gray-500">{job.experience}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
      <Category />
      <JobCollections />
    </>


  )
}

export default HeroSection