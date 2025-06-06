import Navbar from "../../components/homecomponts/Navbar";
import bannerImage from "../../assets/Rectangle 38.png";
import { EllipsisVertical } from "lucide-react";
import { GoPencil } from "react-icons/go";
import { GoPlus } from "react-icons/go";
import EditProileModal from "../../components/User/modals/EditProfileModal";
import EditAboutModal from "../../components/User/modals/EditAboutModal";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getProfile } from "../../services/profile";
import { useLocation } from "react-router-dom";
import Resume from "../../components/User/ProfileComponets/Resume";
import AddExperience from "../../components/User/modals/AddExperience";
import EditExperience from "../../components/User/modals/EditExperience";
import AddEducation, { Education } from "../../components/User/modals/AddEducation";
import AddSkill from "../../components/User/modals/AddSkill";
import ProfileAvathar from "../../assets/user.png"
import EditEducation from "../../components/User/modals/EditEducation";
import EditSkill from "../../components/User/modals/EditSkill";
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'
import Footer from "../../components/homecomponts/Footer";
import { Experience, User } from "../../types/user";
import { formatDateRange } from "../../utils/profileUtils";








const Profile = () => {
    const location = useLocation()
    const [editModalOpen, setEditModal] = useState(false)
    const [editAboutOpen, setAboutModal] = useState(false)
    const [addExperience, setAddExperience] = useState(false)
    const [editExperience, setEditExperience] = useState(false)
    const [addEducation, setAddEducation] = useState(false)
    const [editEducation, setEditEucation] = useState(false)
    const [addSkill, setAddSkill] = useState(false)
    const [editSkill, setEditSkill] = useState(false)
    const [profileData, setProfileData] = useState<User|null>(null);
    const [userName,setUserName]=useState("")
    const [currentExperinceId, setCurrentExperinceId] = useState("")
    const user = useSelector((state: RootState) => state.auth.user)
    const [currentEducationId, setCurrentEducationId] = useState<string>("");

    if (!user) {
        console.error("User data is null!");
        return null;
    }
    const userId = user._id
    const handleEducationClick = (id: string) => {

        setCurrentEducationId(id);
        setEditEucation(true);
    }

    const handelExperienceClick = (id: string) => {
        setCurrentExperinceId(id)
        setEditExperience(true);
    }

    const [, setFormData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
    });

    useEffect(() => {
        if (!currentEducationId || !profileData?.education) return;
        const education = profileData.education.find((edu: Education) => edu._id === currentEducationId);
        if (education) {
            setFormData({
                school: education.school || "",
                degree: education.degree || "",
                fieldOfStudy: education.fieldOfStudy || "",
                startDate: education.startDate ? education.startDate.split("T")[0] : "",
                endDate: education.endDate ? education.endDate.split("T")[0] : "",
                grade: education.grade || "",
            });
        }
    }, [currentEducationId, profileData]);
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile(userId);
                setProfileData(response.user.user);
                setUserName(response.user.user.userName)
            } catch (error) {
                console.error("Error fetching profile:", error);
                return
            }
        };

        fetchProfile();
    }, [userId, location]);
    if (!profileData) {
        return (
            <div className="#bg-[#F6F6F6] flex justify-center items-center h-screen">
                <Bouncy size="45" speed="1.75" color="#FE4F00" />
            </div>
        )
    }

    return (
        <>
            <Navbar />
            {/* profile section */}
            <div
                className="bg-[#F6F6F6] min-h-screen "
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                <div className="p-7 px-4 sm:px-8">


                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg z-0 ">

                        <div className="relative">


                            <div className="">
                                <img
                                    src={bannerImage}
                                    alt="Banner"
                                    className="w-full h-40 object-cover rounded-t-lg z-0 "
                                />
                            </div>

                            <div className=" absolute bottom-35 sm:bottom-35 left-4 sm:left-8   w-22 h-22 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-md">
                                <img
                                    className="w-full h-full  rounded-full object-cover"
                                    src={profileData.profileImage ? profileData.profileImage : ProfileAvathar}
                                    alt="Profile"
                                />
                            </div>

                            <div className=" mt-5 sm:mt-16 p-3  px-6 sm:px-10 flex justify-between  items-center">
                                <div className="">
                                    {profileData ? (
                                        <div className="flex space-x-1">
                                            <h1 className="font-bold text-xl sm:text-2xl">{profileData.firstName}</h1>
                                            <h1 className="font-bold text-xl sm:text-2xl">{profileData.lastName}</h1>
                                        </div>
                                    ) : (
                                        <h1 className="font-bold text-2xl">{userName}</h1>
                                    )}


                                    <p className="font-medium text-sm sm:text-base text-gray-700">{profileData.position || "Please update postion"}</p>
                                    <p className="text-gray-700 text-sm sm:text-base space-y-3.5">
                                        {profileData.location||"No loacation details"}
                                    </p>
                                </div>

                                <div className="flex flex-col   items-end">
                                    <div className=" absolute  right-8  bottom-30 sm:bottom-35 flex  gap-5">
                                        <GoPencil className="font-extralight cursor-pointer w-6 h-6" onClick={() => setEditModal(true)} />
                                        <EllipsisVertical className="cursor-pointer" />
                                    </div>

                                    <div className=" mb-5 flex items-center space-x-4 ">
                                        {/* <img
                                            src={profileImage}
                                            className="w-12 h-12 rounded-full object-coverl border-white border-2"
                                            alt=""
                                        /> */}
                                        <h1 className=" text-base px-5 sm:px-0 sm:text-lg font-semibold text-gray-800">
                                            {profileData.position}
                                        </h1>
                                    </div>

                                    <div className="mb-5 flex space-x-3 ">
                                        {profileData.skills.slice(0, 3).map((skill: string, index: number) => (
                                            <span
                                                key={index}
                                                className=" px-3 sm:px-4 py-1 sm:py-2 bg-orange-200 text-gray-700 rounded-3xl sm:rounded-full text-xs sm:text-sm items-center font-medium"
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
                        <div className="flex justify-between px-2 sm:px-8">
                            <h1 className="font-medium text-2xl">About</h1>
                            <GoPencil className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAboutModal(true)} />
                        </div>
                        <div className=" font-light px-4 sm:px-8 mt-3 p-3">
                            <p className="">
                                {profileData.about ? profileData.about : <p className="text-gray-500 text-md sm:ml-10 mt-3">No about details available.</p>}
                            </p>
                        </div>
                    </div>
                    {editAboutOpen && <EditAboutModal setProfileData={setProfileData} userId={userId} isOpen={editAboutOpen} onClose={() => setAboutModal(false)} />}
                    {/* resueme section */}

                    <Resume userId={userId} setProfileData={setProfileData} />

                    {/* exprience section */}
                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-3 sm:px-8">
                            <h1 className="font-medium text-2xl">Experience</h1>
                            <GoPlus
                                className="font-extralight cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-900"
                                onClick={() => setAddExperience(true)}
                            />
                        </div>
                        {profileData.experiences.length > 0 ? (
                            profileData.experiences.map((experience: Experience, index: number) => (
                                <div key={index} className="border-b ml-3 sm:ml-6 border-gray-100 pb-4 mt-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
                                            <div className="px-2 sm:px-10">
                                                <h2 className="font-semibold text-lg">{experience.title}</h2>
                                                <h3 className="text-md text-gray-700">{experience.company}</h3>
                                                <p className="text-gray-600 text-sm">{formatDateRange(experience.startDate, experience.endDate||"")}</p>
                                                <p className="text-gray-500 text-sm">{experience.location}</p>
                                            </div>
                                        </div>


                                        <div className="flex space-x-3">

                                            <GoPencil
                                                className="font-extralight cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900 mr-8"
                                                onClick={() => handelExperienceClick(experience._id || "")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-md ml-10 mt-3">No experience details available.</p>
                        )}

                    </div>

                    {editExperience && profileData.experiences?.length > 0 && (
                        <EditExperience setProfileData={setProfileData} userId={userId} experienceId={currentExperinceId} isOpen={editExperience} onClose={() => setEditExperience(false)} />)}
                    {addExperience && <AddExperience setProfileData={setProfileData} userId={userId} isOpen={addExperience} onClose={() => setAddExperience(false)} />}


                    {/* educationm */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-3 sm:px-8">
                            <h1 className="font-medium text-2xl">Education</h1>
                            <GoPlus
                                className="font-extralight cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-900"
                                onClick={() => setAddEducation(true)}
                            />
                        </div>
                        {profileData.education.length > 0 ? (
                            profileData.education.map((education: Education, index: number) => (
                                <div key={index} className="border-b border-gray-200 pb-4 ml-3 sm:ml-6 mt-3">

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-4">
        
                                            <div  className="px-2 sm:px-10">
                                                <h2 className="font-semibold text-lg">{education.school}</h2>
                                                <h3 className="text-md text-gray-700">{education.degree}, {education.fieldOfStudy}</h3>
                                                <p className="text-gray-600 text-sm">{formatDateRange(education.startDate, education.endDate)}</p>
                                            </div>
                                        </div>


                                        <div className="flex space-x-3">

                                            <GoPencil
                                                className="font-extralight cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900 mr-8"
                                                onClick={() => handleEducationClick(education._id || "")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-md ml-10 mt-3">No education details available.</p>
                        )}
                    </div>


                    {editEducation && <EditEducation educationId={currentEducationId} setProfileData={setProfileData} userId={userId} isOpen={editEducation} onClose={() => setEditEucation(false)} />}
                    {addEducation && <AddEducation setProfileData={setProfileData} userId={userId} isOpen={addEducation} onClose={() => setAddEducation(false)} />}

                    {/* skills */}

                    <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-4 sm:px-8">
                            <h1 className="font-medium text-2xl">Skills</h1>
                            <div className=" flex space-x-5 ">
                                <GoPlus className="font-extralight cursor-pointer w-6 h-6" onClick={() => setAddSkill(true)} />
                                {/* <GoPencil className="font-extralight cursor-pointer w-5 h-5" onClick={() => setEditSkill(true)} /> */}
                            </div>

                        </div>
                        <div className="mb-5 mt-9 ml-2 sm:ml-10 flex space-x-3 overflow-auto ">
                            {profileData.skills.length > 0 ? (
                                profileData.skills.map((skill: string, index: number) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-orange-200 text-gray-700 rounded-full text-sm font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500 text-md ml-10 mt-3">No skills available.</p>
                            )}

                        </div>
                    </div>
                    {addSkill && <AddSkill existingSkill={profileData.skills} setProfileData={setProfileData} userId={userId} isOpen={addSkill} onClose={() => setAddSkill(false)} />}
                    {editSkill && <EditSkill setProfileData={setProfileData} userId={userId} isOpen={editSkill} onClose={() => setEditSkill(false)} />}

                </div>
            </div>
<Footer/>
        </>
    );
};

export default Profile;
