import { Link } from "react-router-dom"
import SubscriptionBox from "./SubscriptionBox"


const Footer = () => {
    return (
        <div className="bg-[#F6F6F6] pt-20" style={{ fontFamily: "DM Sans, sans-serif" }}>
            <SubscriptionBox/>
            <div className="bg-[#eeeeee] py-5 ">
                <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-cente pt-20">
                    <div className="mb-6 md:mb-0 px-10 sm:px-0">
                        <div className="text-[30px] font-bold flex items-center font-[Montserrat]">
                            <span className="w-9 h-10 md:w-9 md:h-10 bg-orange-600 text-white rounded-lg font-extrabold flex items-center justify-center mr-2">
                                A
                            </span>
                            spivo
                        </div>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                        <Link to={"/about"}><h1 className="hover:text-orange-600 cursor-pointer">About</h1></Link>
                        <Link to={"/jobs"}><h1 className="hover:text-orange-600 cursor-pointer">Jobs</h1></Link>
                        <Link to={"/contact"}><h1 className="hover:text-orange-600 cursor-pointer">Help</h1></Link>
                        <h1 className="hover:text-orange-600 cursor-pointer">Careers</h1>
                        <h1 className="hover:text-orange-600 cursor-pointer">Terms</h1>
                        <h1 className="hover:text-orange-600 cursor-pointer">Blog</h1>
                        <h1 className="hover:text-orange-600 cursor-pointer">Job Referral</h1>
                     
                    </div>
                </div>
                <div className="flex justify-end pt-5">
                    <div className="w-11/12 h-px bg-black my-6"></div>
                </div>




                <p className="text-start text-gray-600 px-20 pt-5">
                    <span className=" text-xs sm:text-sm text-orange-500">@Aspivo 2025</span>. All rights reserved
                </p>
            </div>
        </div>
    )
}

export default Footer