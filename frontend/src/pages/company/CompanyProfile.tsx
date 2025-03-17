import { useState } from "react"
import CompanySidebar from "../../components/Company/ComapnySidebar"
import { IoChevronBackOutline } from "react-icons/io5"
import profile from "../../assets/user.png"
import { GoPencil } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import { FaInstagram, FaLinkedin, FaFacebook } from "react-icons/fa";

const CompanyProfile = () => {
  const [selected, setSelectedMenu] = useState("C Profile")
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
          <div className="flex justify-between   space-x-10 ">
            <div className="flex mt-10 ">
              <IoChevronBackOutline className="w-8 h-8  ml-3 mr-6" />
              <h1 className="text-3xl font-medium  -mt-0"> Company Profile</h1>
            </div>

            <div className="flex p-3  gap-10 mt-5 px-15">

              <div className="mt-1">
                <button className="bg-orange-600 p-2 text-white font-medium rounded-lg px-4 cursor-pointer "> + Post Job</button>
              </div>

              <div className="cursor-pointer font-medium hover:text-orange-600  mt-4 ">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 36 36">
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M32.51 27.83A14.4 14.4 0 0 1 30 24.9a12.6 12.6 0 0 1-1.35-4.81v-4.94A10.81 10.81 0 0 0 19.21 4.4V3.11a1.33 1.33 0 1 0-2.67 0v1.31a10.81 10.81 0 0 0-9.33 10.73v4.94a12.6 12.6 0 0 1-1.35 4.81a14.4 14.4 0 0 1-2.47 2.93a1 1 0 0 0-.34.75v1.36a1 1 0 0 0 1 1h27.8a1 1 0 0 0 1-1v-1.36a1 1 0 0 0-.34-.75" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M18 34.28A2.67 2.67 0 0 0 20.58 32h-5.26A2.67 2.67 0 0 0 18 34.28" />
                </svg>
              </div>


              <div className="bg-orange-600 w-13 border-orange-600 border-3 rounded-full" >
                <img className="w-11.5 h-11.5  p-1  bg-white rounded-full" src={profile} alt="" />
              </div>

            </div>
          </div>
          <hr className="border border-gray-700" />

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