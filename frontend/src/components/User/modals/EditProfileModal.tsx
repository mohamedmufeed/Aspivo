

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VscClose } from "react-icons/vsc";
import { editProfileSchema } from "../../../validation/zod";
import { editProfile, getProfile } from "../../../services/profile";
import axios from "axios";

interface EditProfileForm {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  position: string;
  location: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  setProfileData: (data: any) => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, userId, setProfileData }) => {
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageErorr, setImageErorr] = useState("")
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      position: "",
      location: "",
    },
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getProfile(userId);
        const userData = response.user.user;
        setValue("firstName", userData.firstName || "");
        setValue("lastName", userData.lastName || "");
        setValue("phoneNumber", userData.phoneNumber || "");
        setValue("position", userData.position || "");
        setValue("location", userData.location || "");
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };

    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId, setValue]);





  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);


      const uploadedImageUrl = await uploadToCloudinary(file);
      console.log(uploadedImageUrl);
      if (uploadedImageUrl) {
        setImageUrl(uploadedImageUrl);
      }
    }
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Aspivo");

    try {
      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/do4wdvbcy/image/upload`,
        formData
      );
      console.log("Image uploaded successfully:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageErorr("Failed to upload image");
      console.log(imageErorr)
      return null;
    }
  };

  const onSubmit = async (data: EditProfileForm) => {
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profileImage) {
        formData.append("profileImage", profileImage);
      }
      setLoading(true)
      const response = await editProfile(userId, formData);
      setLoading(false)
      console.log("Profile updated successfully:", response.updatedProfile.user);
      setProfileData(response.updatedProfile.user);

      onClose();
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50" style={{ fontFamily: "DM Sans, sans-serif" }}>
        <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
          <div className="flex justify-between mt-2 px-5 p-5">
            <h1 className="text-2xl font-medium">Edit Profile</h1>
            <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
          </div>
          <hr className="mt-2" />
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="flex bg-white shadow-lg rounded-lg w-5/6 mx-auto mt-5 p-9">
              <div className="relative bg-gray-300 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img

                    src={imageUrl}
                    alt="Company Logo"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-sm text-gray-600">Upload</span>
                )}
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageChange}
                />
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
                  <input type="text" id="firstName" {...register("firstName")} className="border p-2 w-full rounded-lg" />
                  {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" {...register("lastName")} className="border p-2 w-full rounded-lg" />
                  {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input type="text" id="phoneNumber"  {...register("phoneNumber")} className="border p-2 w-full rounded-lg" />
                  {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="position">Current Position</label>
                  <input type="text" id="position" {...register("position")} className="border p-2 w-full rounded-lg" />
                  {errors.position && <p className="text-red-500">{errors.position.message}</p>}
                </div>
              </div>
              <div className="flex flex-col">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" {...register("location")} className="border p-2 w-full rounded-lg" />
                {errors.location && <p className="text-red-500">{errors.location.message}</p>}
              </div>
            </div>
            <hr className="mt-9" />
            <div className="flex justify-end p-6">
              <button type="submit" className="p-3 px-5 bg-orange-600 rounded-lg text-white font-bold">
                {loading ? "Saving . . ." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
