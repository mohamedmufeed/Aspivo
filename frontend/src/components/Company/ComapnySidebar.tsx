import { IoHomeOutline, IoSettingsOutline, IoVideocamOutline } from "react-icons/io5";
import { RiHotelLine } from "react-icons/ri";
import { TbHelp } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsChatLeftText } from "react-icons/bs";
import { CiViewList } from "react-icons/ci";



const menuItems = [
    { icon: <IoHomeOutline className="w-6 h-6" />, label: "Dashboard", path: "/company-dashboard" },
    { icon: <BsChatLeftText className="w-6 h-6" />, label: "Messages", path: "/company-messages" },
    { icon: <IoVideocamOutline className="w-6 h-6" />, label: "Meetings", path: "/company-scheduledmeeting" },
    { icon: <RiHotelLine className="w-6 h-6" />, label: "C Profile", path: "/company-profile" },
    { icon: <CiViewList className="w-6 h-6" />, label: "Job Listing", path: "/company-jobs" },
    { divider: true },
    { icon: <IoSettingsOutline className="w-6 h-6" />, label: "Settings", path: "/settings" },
    { icon: <TbHelp className="w-6 h-6" />, label: "Help", path: "/help" },
];

const CompanySidebar = () => {
    const [selected, setLocalSelected] = useState<string | undefined>("Dashboard");
    const navigate = useNavigate()
    const location = useLocation()
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);
    useEffect(() => {
        const currentItem = menuItems.find((item) => item.path === location.pathname)
        if (currentItem) {
            setLocalSelected(currentItem.label)
        }
    }, [location])
    const handleSelect = (label?: string, path?: string) => {
      if (!label || !path) return;

        if (label === "Settings" || label === "Help") {
            setComingSoonLabel(label);
            setTimeout(() => setComingSoonLabel(null), 2000); 
            return;
        }
        setLocalSelected(label);
        navigate(path);
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
                              {comingSoonLabel === item.label && (
                                <span className="absolute top-1/2 right-[-50px] transform -translate-y-1/2 bg-orange-600 text-white text-sm px-2 py-1 rounded-md shadow-md whitespace-nowrap">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                    )
                ))}
            </div>

            <div className="mt-5">
                <hr className=" relative border-2 left-17.5 border-gray-500 -rotate-19 mt-10 w-40 " />
                <hr className="border-2 relative top-13 left-11 w-16 border-gray-500 rotate-90" />

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
