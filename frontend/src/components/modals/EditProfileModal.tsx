import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { editProfile } from "../../services/profile";




interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userId }) => {
    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        position: "",
        location: "",
    });

    const [profileImage, setProfileImage] = useState<File | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProfileImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("firstName", profile.firstName);
            formData.append("lastName", profile.lastName);
            formData.append("phone", profile.phone);
            formData.append("position", profile.position);
            formData.append("location", profile.location);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }
          

            const response = await editProfile(userId, formData);
            console.log("Profile updated successfully:", response);
            onClose();
        } catch (error) {
            console.error("Profile update error:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Edit Profile</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="flex bg-white shadow-lg rounded-lg w-5/6 mx-auto mt-5 p-9">
                            <div className="relative bg-gray-300 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                                <input 
                                    type="file" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                      name="profileImage" onChange={handleImageChange} 
                                />
                                <span className="text-sm text-gray-600">Upload</span>
                            </div>
                            <div className="flex flex-col items-start pl-8 mt-9">
                                <h3 className="font-semibold text-lg">Upload Photo</h3>
                                <p className="text-gray-500 text-sm">At least 800 × 800 px recommended.</p>
                            </div>
                        </div>

                        <h2 className="font-medium text-lg pl-5 mt-6">Personal Information</h2>
                        <div className="space-y-5 mt-8 px-7 flex flex-col">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" id="firstName"  name="firstName" value={profile.firstName} onChange={handleChange} className="border p-2 w-full rounded-lg" required />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" value={profile.lastName} onChange={handleChange} className="border p-2 w-full rounded-lg" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="text" id="phone" name="phone" value={profile.phone} onChange={handleChange} className="border p-2 w-full rounded-lg" required />
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="position">Current Position</label>
                                    <input type="text" id="position" name="position" value={profile.position} onChange={handleChange} className="border p-2 w-full rounded-lg" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location" value={profile.location} onChange={handleChange} className="border p-2 w-full rounded-lg" />
                            </div>
                        </div>
                        <hr className="mt-9" />
                        <div className="flex justify-end p-6">
                            <button type="submit" className="p-3 px-5 bg-orange-600 rounded-lg text-white font-bold">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;
