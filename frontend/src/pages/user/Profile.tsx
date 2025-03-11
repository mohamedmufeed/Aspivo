import Navbar from "../../components/homecomponts/Navbar";
import bannerImage from "../../assets/Rectangle 38.png";
import profileImage from "../../assets/person_1.jpg";
import { EllipsisVertical } from "lucide-react";
import { GoPencil } from "react-icons/go";
import { FcGoogle } from "react-icons/fc";
import { GoPlus } from "react-icons/go";
import EditProileModal from "../../components/modals/EditProfileModal";
import EditAboutModal from "../../components/modals/EditAboutModal";
import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getProfile } from "../../services/profile";
import { useLocation } from "react-router-dom";
import Resume from "../../components/ProfileComponets/Resume";
import AddExperience, { Experience } from "../../components/modals/AddExperience";
import EditExperience from "../../components/modals/EditExperience";
import AddEducation, { Education } from "../../components/modals/AddEducation";

const Profile = () => {
    const location = useLocation()
    const [editModalOpen, setEditModal] = useState(false)
    const [editAboutOpen, setAboutModal] = useState(false)
    const [addExperience, setAddExperience] = useState(false)
    const [editExperience, setEditExperience] = useState(false)
    const [addEducation, setAddEducation] = useState(false)
    const [profileData, setProfileData] = useState<any>(null);
    const user = useSelector((state: RootState) => state.auth.user)

    if (!user) {
        console.error("User data is null!");
        return null;
    }
    const userId = user._id


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
    }, [userId, location]);

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
                                    {profileData ? (
                                        <div className="flex space-x-1">
                                            <h1 className="font-bold text-2xl">{profileData.firstName}</h1>
                                            <h1 className="font-bold text-2xl">{profileData.lastName}</h1>
                                        </div>
                                    ) : (
                                        <h1 className="font-bold text-2xl">{profileData?.userName}</h1>
                                    )}


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
                    {editModalOpen && <EditProileModal setProfileData={setProfileData} userId={userId} isOpen={editModalOpen} onClose={() => setEditModal(false)} />}

                    {/* aboutSection */}

                    <div className="bg-white  shadow-gray-100 shadow-lg w-full rounded-lg  p-5 mt-5">
                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">About</h1>
                            <GoPencil className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAboutModal(true)} />
                        </div>
                        <div className=" font-light px-8 mt-3 p-3">
                            <p className="">
                                {profileData.about}
                            </p>
                        </div>
                    </div>
                    {editAboutOpen && <EditAboutModal setProfileData={setProfileData} userId={userId} isOpen={editAboutOpen} onClose={() => setAboutModal(false)} />}
                    {/* resueme section */}

                    <Resume />

                    {/* exprience section */}
                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">

                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Experience</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAddExperience(true)} />
                                <GoPencil className="font-extralight cursor-pointer w-5 h-5" onClick={() => setEditExperience(true)} />
                            </div>

                        </div>

                        {profileData.experiences.map((experience: Experience, index: number) => (
                            <div key={index} className="flex items-center space-x-4 p-4 mt-3">
                                <FcGoogle className="w-10 h-10" />

                                <div>
                                    <h2 className="font-semibold text-lg">{experience.title}</h2>
                                    <h3 className="text-md text-gray-700">{experience.company}</h3>
                                    <p className="text-gray-600 text-sm">Jun 2024 - Present • 9 mos</p>
                                    <p className="text-gray-500 text-sm">{experience.location}</p>
                                </div>
                            </div>
                        ))}


                    </div>

                    {addExperience && <AddExperience setProfileData={setProfileData} userId={userId} isOpen={addExperience} onClose={() => setAddExperience(false)} />}

                    {editExperience && profileData.experiences?.length > 0 && (
                        <EditExperience setProfileData={setProfileData} userId={userId} experienceId={profileData.experiences[0].id} isOpen={editExperience} onClose={() => setEditExperience(false)} />)}
                    {/* educationm */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">

                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Education</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAddEducation(true)} />
                                <GoPencil className="font-extralight cursor-pointer w-5 h-5" />
                            </div>

                        </div>

                        {profileData.education.map((education:Education, index:number) => (
                            <div key={index} className="flex items-center space-x-4 p-4 mt-3">

                                <FcGoogle className="w-10 h-10" />


                                <div>
                                    <h2 className="font-semibold text-lg">{education.school}</h2>
                                    <h3 className="text-md text-gray-700">{education.degree} ,{education.fieldOfStudy}</h3>
                                    <p className="text-gray-600 text-sm">Sep 2021 - Jun 2023</p>
                                </div>
                            </div>
                        ))}


                    </div>
                    {addEducation && <AddEducation setProfileData={setProfileData} userId={userId} isOpen={addEducation} onClose={() => setAddEducation(false)} />}

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
