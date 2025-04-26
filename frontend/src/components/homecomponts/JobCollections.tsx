import { FcGoogle } from "react-icons/fc"
import { IoIosArrowRoundForward } from "react-icons/io";



const JobCollections = () => {
  return (
    <div className="bg-[#F6F6F6] w-full sm:w-auto" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="sm:pt-10">
        <h1 className=" sm:pt-10 sm:text-3xl text-2xl font-semibold text-center">Featured Job Circulars</h1>
        <div className="flex justify-end px-10 p-6 sm:p-0 md:p-0  sm:px-23 md:px-23 sm:pt-0 md:pt-0 cursor-pointer">
          <h1>View all </h1>
          <IoIosArrowRoundForward className="w-6 h-6"/>
        </div>
        <div className=" grid grid-cols-12 space-x-4  px-6 sm:px-20 sm:pt-10 gap-5 ">
          {/* card */}
          <div className="bg-white shadow-xl rounded-xl col-span-12 md:col-span-4 h-auto  mb-6  transform transition-all hover:shadow-2xl  hover:scale-105">
            <div className="p-8">
              <div className="flex space-x-3 ">
                <FcGoogle className="w-13 h-13" />
                <div className="">
                  <h1 className="font-semibold text-xl">Google</h1>
                  <p className="text-gray-500 text-sm">New York ,USA</p>
                </div>
              </div>
              <div >
                <h1 className="font-medium text-3xl pt-8">Senior Developer </h1>
                <p className="text-md text-gray-500 pl-1">Full time</p>
              </div>
              <p className="text-md  pt-6 text-gray-700">
                You will be executed to lead the company 's entire stratagy
              </p>
              <div className="flex pt-10  justify-between">
                <div className="flex items-center">
                  <h1 className="font-semibold text-3xl sm:text-2xl ">2500$</h1>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
                <button className="bg-orange-600 text-white font-bold p-3 rounded-lg cursor-pointer hover:bg-orange-700">Apply Now</button>
              </div>
            </div>

          </div>
          {/* card ends */}

          <div className="bg-white shadow-xl rounded-xl col-span-12 md:col-span-4 h-auto  mb-6  transform transition-all hover:shadow-2xl  hover:scale-105">
            <div className="p-8">
              <div className="flex space-x-3 ">
                <FcGoogle className="w-13 h-13" />
                <div className="">
                  <h1 className="font-semibold text-xl">Google</h1>
                  <p className="text-gray-500 text-sm">New York ,USA</p>
                </div>
              </div>
              <div >
                <h1 className="font-medium text-3xl pt-8">Senior Developer </h1>
                <p className="text-md text-gray-500 pl-1">Full time</p>
              </div>
              <p className="text-md  pt-6 text-gray-700">
                You will be executed to lead the company 's entire stratagy
              </p>
              <div className="flex pt-10  justify-between">
                <div className="flex items-center">
                  <h1 className="font-semibold text-3xl sm:text-2xl ">2500$</h1>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
                <button className="bg-orange-600 text-white font-bold p-3 rounded-lg cursor-pointer hover:bg-orange-700">Apply Now</button>
              </div>
            </div>

          </div>


          <div className="bg-white shadow-xl rounded-xl col-span-12 md:col-span-4 h-auto  mb-6  transform transition-all hover:shadow-2xl  hover:scale-105">
            <div className="p-8">
              <div className="flex space-x-3 ">
                <FcGoogle className="w-13 h-13" />
                <div className="">
                  <h1 className="font-semibold text-xl">Google</h1>
                  <p className="text-gray-500 text-sm">New York ,USA</p>
                </div>
              </div>
              <div >
                <h1 className="font-medium text-3xl pt-8">Senior Developer </h1>
                <p className="text-md text-gray-500 pl-1">Full time</p>
              </div>
              <p className="text-md  pt-6 text-gray-700">
                You will be executed to lead the company 's entire stratagy
              </p>
              <div className="flex pt-10  justify-between">
                <div className="flex items-center">
                  <h1 className="font-semibold text-3xl sm:text-2xl ">2500$</h1>
                  <p className="text-sm text-gray-500">/month</p>
                </div>
                <button className="bg-orange-600 text-white font-bold p-3 rounded-lg cursor-pointer hover:bg-orange-700">Apply Now</button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default JobCollections