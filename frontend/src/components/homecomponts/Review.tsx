import profileimge from "../../assets/person_1.jpg"
const Review = () => {
  return (
    <div className="bg-[#F6F6F6] " style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="text-center font-semibold text-2xl sm:text-3xl md:text-3xl pt-25">
        <div className="pb-3"> <span className="text-orange-600"> Reviews </span>  of People Who Have Found Jobs <br /> <span>     Through Aspivo</span></div>
      </div>
      <div className="px-5 sm:px-50 pt-15 ">
        <div className="bg-white  rounded-2xl p-5 sm:p-9">
          <div className="flex justify-center ">
            <img src={profileimge} alt="profile-image" className="w-20 h-20 rounded-full shadow-md " />
          </div>
          <div className="flex justify-center text-center text-sm sm:text-lg text-gray-500 pt-10 px-3 sm:px-20">
            <p>“Aspivo made my job search so easy! I found my dream role within days. The platform is user-friendly, and the job recommendations were spot on.”</p>
          </div>
          <div className="text-center pt-5 space-y-2">
            <h2 className="font-semibold text-lg ">Aisha R</h2>
            <p className="text-gray-600 text-sm sm:text-base">Software Developer</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-4">
        <div className="flex space-x-2 mt-4">
          <span className="w-15 h-2.5 rounded-3xl bg-orange-600"></span>
          <span className="w-10 h-2.5 rounded-3xl bg-gray-300"></span>
          <span className="w-10 h-2.5 rounded-3xl  bg-gray-300"></span>
        </div>
      </div>


    </div>
  )
}

export default Review