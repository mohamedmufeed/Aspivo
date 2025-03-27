import { useState } from "react"
import CompanySidebar from "../../components/Company/ComapnySidebar"
import { IoChevronBackOutline } from "react-icons/io5"
import profile from "../../assets/user.png"
import { GoPencil } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";
import ComapanyHeader from "../../components/Company/ComapanyHeader";

const CompanyProfile = () => {
  const [selected, setSelectedMenu] = useState("Dashboard")
  const [heading,setHeading]=useState("Company Profile")
  const techStacks = [
    { name: "MERN Stack", icon: "https://via.placeholder.com/40" },
    { name: "Django", icon: "https://via.placeholder.com/40" },
    { name: "Java", icon: "https://via.placeholder.com/40" },
  ];
  const team = [
    { name: "John Doe", position: "Software Engineer" },
    { name: "Jane Smith", position: "Project Manager" },
    { name: "Alice Johnson", position: "UI/UX Designer" }
  ];
  const socialLinks = [
    { name: "Instagram", icon: <FaInstagram className="text-pink-500 w-6 h-6" />, link: "https://instagram.com" },
    { name: "LinkedIn", icon: <FaLinkedin className="text-blue-600 w-6 h-6" />, link: "https://linkedin.com" },
    { name: "Facebook", icon: <FaFacebook className="text-blue-500 w-6 h-6" />, link: "https://facebook.com" },
  ];
  return (
    <div>
      <div className="flex">
        <CompanySidebar setSelected={setSelectedMenu} />
        <div className="bg-[#F6F6F6] w-full  overflow-x-hidden relative" style={{ fontFamily: "DM Sans, sans-serif" }}>

          {/* header */}
         <ComapanyHeader heading={heading}/>

          {/* headerr ends */}

          <div className="p-7 mt-4">

            <div className="bg-white rounded-2xl shadow-md shadow-gray-100 p-6 w-full max-w-6xl mx-auto flex items-center gap-16 relative">

              <GoPencil className="absolute top-7 right-8 w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-700" />


              <div className="w-28 h-28 bg-white rounded-full shadow-lg flex items-center justify-center border mt-5 border-gray-300">
                <img src={profile} alt="Company Logo" className="w-24 h-24 rounded-full" />
              </div>


              <div>
                <h2 className="text-2xl font-semibold">Google</h2>
                <a href="https://google.com" className="text-black hover:underline hover:text-orange-600">https://google.com</a>

                <div className="grid grid-cols-4 gap-6 text-gray-600 mt-6">
                  <div>
                    <h3 className="font-medium">Founded</h3>
                    <p className="text-black font-medium">Feb 29 2025</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Employees</h3>
                    <p className="text-black font-medium">200+</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Location</h3>
                    <p className="text-black font-medium">2 Countries</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Industry</h3>
                    <p className="text-black font-medium">Software Development</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-5">

              <div className="bg-white  shadow-gray-100 shadow-lg w-2/3 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-6">
                  <h1 className="font-medium text-2xl">Company Profile</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                </div>
                <div className=" font-light px-8 mt-3 p-3">
                  <p className="">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci porro sint cumque mollitia excepturi minus ratione, assumenda tempora reiciendis nesciunt autem commodi iure illo necessitatibus nemo perferendis id laudantium exercitationem.  Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia est pariatur aliquam, rem suscipit perspiciatis officiis, quis laudantium neque at accusamus provident exercitationem impedit ratione earum id consequuntur voluptatem incidunt?
                  </p>
                </div>
              </div>



              <div className="bg-white  shadow-gray-100 shadow-lg w-1/3 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Tech Stack</h1>
                  <div className="flex gap-5">
                    <GoPlus className="font-extralight cursor-pointer w-6 h-6" />
                    <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                  </div>

                </div>

                <div className="px-6 mt-4 space-y-1">
                  {techStacks.map((stack, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-md ">
                      <div className="bg-[#eb5a0023] p-2 rounded-lg">
                        <img src={stack.icon} alt={stack.name} className="w-8 h-8 rounded-full" />
                      </div>

                      <h3 className="font-medium text-lg">{stack.name}</h3>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            <div className="flex gap-5">
              <div className="bg-white  shadow-gray-100 shadow-lg w-2/4 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Team</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                </div>

                <div className="px-6 mt-4 flex items-center gap-4 overflow-x-auto">
                  {team.map((member, index) => (
                    <div key={index} className="flex flex-col items-center p-4 bg-[#eb5a0023] rounded-lg shadow-md min-w-[200px]">
                      <h3 className="font-semibold text-lg text-gray-800">{member.position}</h3>
                      <p className="text-gray-600">{member.name}</p>
                    </div>
                  ))}
                </div>

              </div>


              <div className="bg-white  shadow-gray-100 shadow-lg w-2/4 rounded-lg  p-5 mt-5">
                <div className="flex justify-between px-3">
                  <h1 className="font-medium text-2xl">Contact</h1>
                  <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                </div>
                <div className="flex gap-4 p-4 rounded-lg ">
                  {socialLinks.map((social, index) => (
                    <a key={index} href={social.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                      {social.icon}
                      <span className="text-gray-700 font-medium">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>


            </div>




          </div>



        </div>
      </div>




    </div>
  )
}

export default CompanyProfile