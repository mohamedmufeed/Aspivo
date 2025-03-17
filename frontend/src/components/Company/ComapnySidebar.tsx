import { IoHomeOutline, IoSettingsOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { TbHelp } from "react-icons/tb";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsChatLeftText } from "react-icons/bs";
import { HiOutlineUsers } from "react-icons/hi2";
import { CiViewList } from "react-icons/ci";



const menuItems = [
    { icon: <IoHomeOutline className="w-6 h-6" />, label: "Dashboard", path: "/company-dashboard" },
    { icon: <BsChatLeftText className="w-6 h-6" />, label: "Messages", path: "/company-messages" },
    { icon: <HiOutlineUsers className="w-6 h-6" />, label: " Applicants", path: "/requests" },
    { icon: <RiHotelLine className="w-6 h-6" />, label: "C Profile", path: "/company-profile" },
    { icon: <CiViewList className="w-6 h-6" />, label: "Job Listing", path: "/subscription" },
    { divider: true },
    { icon: <IoSettingsOutline className="w-6 h-6" />, label: "Settings", path: "/settings" },
    { icon: <TbHelp className="w-6 h-6" />, label: "Help", path: "/help" },
];

const CompanySidebar = ({setSelected}:{setSelected:(label:string)=>void}) => {
    const [selected, setLocalSelected] = useState<string | null>("Dashboard");
const navigate= useNavigate()
    const handleSelect = (label?: string, path?: string) => {
        if(label && path ){
            setLocalSelected(label); 
            setSelected(label); 
            navigate(path); 
        }
     
    };
    return (
        <div className='bg-[#eb5a0023] w-1/6 h-screen px-3' style={{ fontFamily: "DM Sans, sans-serif" }}>
            <div className="text-[30px] pl-10 pt-15 ps-8 font-bold flex items-center font-[Montserrat]">
                <span className="w-9 h-10 md:w-9 md:h-10 bg-orange-600 text-white rounded-lg font-extrabold flex items-center justify-center mr-1">A</span>
                spivo
            </div>
            <div className="mt-15 space-y-4 p-4">
            {menuItems.map((item, index) => (
                    item.divider ? <hr key={index} className="my-2 w-full" /> : (
                        <div 
                            key={index} 
                            className={`relative flex items-center space-x-4 cursor-pointer p-3 rounded-md ${selected === item.label ? 'bg-[#eb5a0048] text-black' : 'hover:bg-orange-200/80'}`}
                            onClick={() => handleSelect(item.label, item.path)}

                        >
                            {selected === item.label && <span className="absolute right-44 top-0 h-full w-2 bg-orange-600 rounded"></span>}
                            {item.icon}
                            <h4 className="text-lg pl-3 ">{item.label}</h4>
                        </div>
                    )
                ))}
            </div>

       <div className="mt-5">
         <hr className=" relative border-2 left-17.5 border-gray-500 -rotate-19 mt-10 w-40 " />
     <hr className="border-2 relative top-13 left-11 w-16 border-gray-500 rotate-90"  />
 
     <div className=" relative top-7 right-3 border-t-2  border-gray-500 bg-[#eb5a0048] w-60 h-40" style={{ clipPath: "polygon(0 51%, 100% 0, 100% 100%, 0% 100%)" }}>
  Custom Shape
</div>
<div>

</div>
         </div>


           


        </div>
    );
};

export default CompanySidebar;
