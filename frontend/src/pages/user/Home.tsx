import bannerImage from "../../assets/job-interview-concept-illustration.png"
import { IoIosArrowForward } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaMeta } from "react-icons/fa6";
import { FaGoogle } from "react-icons/fa";
import { FaAirbnb } from "react-icons/fa";
import Category from "../../components/homecomponts/Category";
import Navbar from "../../components/homecomponts/Navbar";
import JobCollections from "../../components/homecomponts/JobCollections";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import Review from "../../components/homecomponts/Review";
import Footer from "../../components/homecomponts/Footer";

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



  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const isAdmin=useSelector((state:RootState)=>state.auth.isAdmin)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate,user]);

  
  useEffect(()=>{
    if(isAdmin){
          navigate("/admin-dashboard")
    }else{
       navigate("/")
    }
  },[user,navigate])

  const heroTextRef = useRef(null);
  const searchBoxRef = useRef(null);
  const paragraphRef = useRef(null);
  const jobbox = useRef(null);
  const jobContent = useRef(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(heroTextRef.current, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 1 })
        .fromTo(paragraphRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
        .fromTo(searchBoxRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.5")
        .fromTo(jobbox.current, { opacity: 0, height: "50px", y: -50 }, { opacity: 1, height: "320px", y: 0, duration: 1, ease: "power1.inOut" }, "-=0.5");

      tl.fromTo(jobContent.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" }, "-=0.5");

    });

    return () => ctx.revert();
  }, [])

  return (
    <div onClick={()=>setIsDropdownOpen(false)}>
      <Navbar isDropdownOpen={isDropdownOpen} setIsDropdownOpen={setIsDropdownOpen} />
      <section className="flex h-screen  bg-[#F6F6F6]" style={{ fontFamily: "DM Sans, sans-serif" }}>
        {/*content Sction */}
        <div className=" mt-2 sm:mt-5">
          <h1 ref={heroTextRef} className="font-[Montserrat] font-semibold text-6xl sm:text-7xl ps-15 sm:ps-24 mt-15 sm:mt-36">Find Your <br /> Dream Job Here <br /> In one Place</h1>
          <p ref={paragraphRef} className="ps-15 sm:ps-24 mt-8   font-extralight " >Explore thousands of job opportunities Find the perfect <br /> role that suits you.</p>

          {/*serach bar*/}
          <div ref={searchBoxRef} className="bg-white w-90 sm:w-96  ml-5 sm:ml-24 mt-8  h-16 rounded-lg shadow-lg">
            <form className=" " action="">
              <div className="flex ">
                <label htmlFor="serach" className="text-[#837F7F] whitespace-nowrap   p-5  ml-auto  font-extralight" >Click here to explore more jobs</label>
   
                <button className="w-20 h-14  ml-auto mt-1  mr-1  flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white cursor-pointer " onClick={() => navigate("/jobs")}>
                  <IoIosArrowForward className="w-6  h-10 " />
         
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
          <div ref={jobbox} className=" hidden sm:block bg-black/5 backdrop-blur-md border absolute -mt-35 ml-40 border-white/30 rounded-2xl shadow-white-lg w-80  ps-4 h-80">
            <div ref={jobContent} className="opacity-0">
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
        </div>
      </section>
      <Category />
      <JobCollections />
      <Review />
      <Footer/>
    </div>


  )
}

export default HeroSection