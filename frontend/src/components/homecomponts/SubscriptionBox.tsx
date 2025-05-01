import { Link } from "react-router-dom"

const SubscriptionBox = () => {
    return (
        <div className=" relative top-15 px-5 sm:px-20 " style={{ fontFamily: "DM Sans, sans-serif" }}>
            <div className=" bg-white  rounded-lg p-10 sm:p-15 flex flex-col sm:flex-row justify-between ">
                <div className="space-y-3 "> 
                    <h1 className=" text-3xl sm:text-4xl font-semibold">Never want to Miss </h1>
                       <h1 className=" text-3xl sm:text-4xl font-semibold text-orange-600"> Any Job News ?</h1>
                </div>
                <div>
                    <div className="flex   rounded-lg p-3 sm:p-4  items-center justify-between  sm:max-w-md  w- pt-10 ">
                        <Link to={"/subscription"}> 
                        <button className="bg-orange-600 font-bold text-white rounded-md px-3 sm:px-4 py-2 sm:py-2 sm:text-base text-sm hover:bg-orange-700 transition">
                            Subscribe
                        </button></Link>
                   
                    </div>
                </div>
            </div>

        </div>
    )
}

export default SubscriptionBox