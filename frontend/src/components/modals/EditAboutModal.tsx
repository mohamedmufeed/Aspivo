import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { editAbout, getProfile } from "../../services/profile";
import { editAboutSchema } from "../../validation/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData:(prev:any)=>void
}

 interface  FormData{
    about:string
 }

const EditAboutModal: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const [about, setAbout] = useState<string>("")

    
    const { register, handleSubmit, formState: { errors } ,setValue} = useForm<FormData>({
        resolver: zodResolver(editAboutSchema),
        defaultValues:{
            about:" "
        }
    });

     useEffect(() => {
        const fetchUserProfile = async () => {
          try {
           const response = await getProfile(userId);
            const userData = response.user.user;
    
             console.log("Fetched User Data:", userData);
              setValue("about", userData.about || "");
          
          } catch (error) {
            console.error("Failed to fetch user profile", error);
          }
        };
      
        if (isOpen && userId) {
          fetchUserProfile();
        }
      }, [isOpen, userId, setValue]);

    const onSubmit = async (data:FormData) => {
        
        try {
            const response= await editAbout(userId,data.about)
            console.log("the response is ",response)
            setProfileData(response.user.user)
            
            onClose()
        } catch (error) {
            console.error("Profile update error:", error);
        }

    }
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Edit About</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <form action="#" onSubmit={handleSubmit(onSubmit)}>



                        <div className="space-y-5 mt-8 px-7 flex flex-col">


                            <div className="flex flex-col">
                                <p className="mt-3 text-md text-gray-600">You can write about your years of experience, industry, or skills. People also talk about their achievements or previous job experiences.</p>
                                {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about.message}</p>}
                                <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900"></label>
                                <div className="mt-2">
                                    <textarea    {...register("about")}  name="about" id="about" value={about} rows={3} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6" onChange={(e) => setAbout(e.target.value)}></textarea>
                                </div>

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
    )
}

export default EditAboutModal