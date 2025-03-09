import Navbar from "../../components/homecomponts/Navbar";
import bannerImage from "../../assets/Rectangle 38.png";
import profileImage from "../../assets/person_1.jpg";
import { EllipsisVertical } from "lucide-react";
import { CiStickyNote } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import { AiOutlineDelete } from "react-icons/ai";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { GoPlus } from "react-icons/go";
import EditProileModal from "../../components/modals/EditProfileModal";
import EditAboutModal from "../../components/modals/EditAboutModal";
import {  useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getProfile } from "../../services/profile";

const Profile = () => {
    const [editModalOpen, setEditModal] = useState(false)
    const [editAboutOpen, setAboutModal] = useState(false)
    const [profileData, setProfileData] = useState<any>(null);
    const user= useSelector((state:RootState)=>state.auth.user)
    if (!user) {
        console.error("User data is null!");
        return null;
    }
  const userId=user._id

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(userId);
        setProfileData(response.user.user);
      console.log(response.user.user)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile(); 
  }, [userId]); 
  
  if (!profileData) {
    return <p>Loading profile...</p>; 
  }

    return (
        <>
            <Navbar />

            {/* profile section */}
            <div
                className="bg-[#F6F6F6] min-h-screen"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                <div className="p-7 px-8">


                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg ">

                        <div className="relative">


                            <div className="">
                                <img
                                    src={bannerImage}
                                    alt="Banner"
                                    className="w-full h-40 object-cover rounded-t-lg"
                                />
                            </div>

                            <div className=" absolute bottom-35 left-8   w-32 h-32 rounded-full border-4 border-white shadow-md">
                                <img
                                    className="w-full h-full  rounded-full object-cover"
                                    src={profileImage}
                                    alt="Profile"
                                />
                            </div>

                            <div className="mt-16 p-3 px-10 flex justify-between  items-center">
                                <div className="">
                                    <div className="flex space-x-1">       <h1 className="font-bold text-2xl">{profileData.firstName}</h1>
                                    <h1 className="font-bold text-2xl">{profileData.lastName}</h1>
                                    </div>
                             
                                    <p className="font-medium text-gray-700">{profileData.position}</p>
                                    <p className="text-gray-700 space-y-3.5">
                                 {profileData.location}
                                    </p>
                                </div>

                                <div className="flex flex-col   items-end">
                                    <div className=" absolute  right-8  bottom-43 flex  gap-5">
                                        <GoPencil className="font-extralight cursor-pointer w-6 h-6" onClick={() => setEditModal(true)} />
                                        <EllipsisVertical className="cursor-pointer" />
                                    </div>

                                    <div className=" mb-5 flex items-center space-x-4 ">
                                        <img
                                            src={profileImage}
                                            className="w-12 h-12 rounded-full object-coverl border-white border-2"
                                            alt=""
                                        />
                                        <h1 className="text-lg font-semibold text-gray-800">
                                        {profileData.position}
                                        </h1>
                                    </div>

                                    <div className="mb-5 flex space-x-3 ">
                                        {["HTML", "CSS", "JavaScript"].map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-orange-200 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {editModalOpen && <EditProileModal userId={userId} isOpen={editModalOpen} onClose={() => setEditModal(false)} />}

                    {/* aboutSection */}

                    <div className="bg-white  shadow-gray-100 shadow-lg w-full rounded-lg  p-5 mt-5">
                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">About</h1>
                            <GoPencil className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAboutModal(true)} />
                        </div>
                        <div className=" font-light px-8 mt-3 p-3">
                            <p className="">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam,
                                dolores cum incidunt vero magnam repellat beatae accusamus nemo
                                ipsum optio mollitia eius omnis soluta nisi ex. Assumenda nemo
                                dolores pariatur. Lorem ipsum dolor, sit amet consectetur
                                adipisicing elit. Esse voluptatem ducimus a quis dolor autem
                                rem! Culpa tempora odio illum quia deleniti reiciendis suscipit
                                fuga iure optio, consequuntur, eum voluptatibus.
                            </p>
                        </div>
                    </div>
                    {editAboutOpen && <EditAboutModal userId={userId} isOpen={editAboutOpen} onClose={() => setAboutModal(false)} />}
                    {/* resueme section */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Resume</h1>
                        </div>

                        <div className="flex mx-auto w-3/4 bg-white h-[60px] items-center shadow-gray-200 shadow-lg rounded-md justify-between px-6 mt-4">
                            <div className="flex items-center space-x-4">
                                <CiStickyNote className="w-6 h-6 text-gray-600" />
                                <p className="text-gray-700">Johndaniel_resume.pdf</p>
                            </div>
                            <div className="flex space-x-6">
                                <BsDownload className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                                <AiOutlineDelete className="w-6 h-6  text-gray-600 cursor-pointer hover:text-gray-800" />
                            </div>
                        </div>

                        <div className="w-5/6 mx-auto mt-5 p-6 flex flex-col items-center justify-center rounded-lg outline-1.5 px-6 outline-dashed">
                            <IoCloudUploadOutline className="w-8 h-8 text-gray-900 mb-2" />
                            <h2 className="font-bold text-md text-gray-700 text-center">
                                Drag and Drop file here or{" "}
                                <span className="text-orange-600 cursor-pointer">
                                    Choose File
                                </span>
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Supported Formats: PDF, JPEG
                            </p>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button className="font-semibold px-6 py-3 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>

                    {/* exprience section */}
                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">

                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Experience</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" />
                                <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                            </div>

                        </div>


                        <div className="flex items-center space-x-4 p-4 mt-3">

                            <FcGoogle className="w-10 h-10" />


                            <div>
                                <h2 className="font-semibold text-lg">Software Engineer</h2>
                                <h3 className="text-md text-gray-700">Google</h3>
                                <p className="text-gray-600 text-sm">Jun 2024 - Present • 9 mos</p>
                                <p className="text-gray-500 text-sm">Bangalore, India • Onsite</p>
                            </div>
                        </div>
                    </div>


                    {/* educationm */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">

                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Education</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" />
                                <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                            </div>

                        </div>


                        <div className="flex items-center space-x-4 p-4 mt-3">

                            <FcGoogle className="w-10 h-10" />


                            <div>
                                <h2 className="font-semibold text-lg">Oxford University</h2>
                                <h3 className="text-md text-gray-700">Master of Computer Applications - MCA , Computer Science </h3>
                                <p className="text-gray-600 text-sm">Sep 2021 - Jun 2023</p>
                            </div>
                        </div>
                    </div>

                    {/* skills */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Skills</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" />
                                <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                            </div>

                        </div>
                        <div className="mb-5 mt-9 ml-10 flex space-x-3 ">
                            {["HTML", "CSS", "JavaScript"].map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-orange-200 text-gray-700 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Profile;
