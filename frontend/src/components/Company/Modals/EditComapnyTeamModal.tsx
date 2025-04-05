
import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { GoPlus } from "react-icons/go";
import { editEducation, getProfile } from "../../../services/profile";
import { educationSchema } from "../../../validation/zod";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
    educationId: string
}
export interface Education {
    _id?: string
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
}


const EditEducation: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId, educationId }) => {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
        educationId: educationId
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "startDate" || name === "endDate") {
            formattedValue = new Date(value).toISOString().split("T")[0];
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };


    const validateForm = (data: Education) => {
        const result = educationSchema.safeParse(data)
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                if (err.path) {
                    formattedErrors[err.path[0]] = err.message
                }
            })

            setErrors(formattedErrors)
        } else {
            setErrors({})
        }
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {

                const response = await getProfile(userId)
                const user = response.user.user
                if (user && user.education) {
                    const education = user.education.find((edu: Education) => edu._id === educationId)
                    if (education) {
                        setFormData({
                            school: education.school,
                            degree: education.degree,
                            fieldOfStudy: education.fieldOfStudy,
                            startDate: education.startDate,
                            endDate: education.endDate,
                            grade: education.grade,
                            educationId: education._id
                        });
                    }
                }



                console.log(" the resposen", user)

            } catch (error) {
console.log("Errrpr ",error)
            }
        }

        if (isOpen) {
            fetchUserProfile()
        }
    }, [isOpen, userId, educationId])


    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();

        const result = educationSchema.safeParse(formData);
        if (!result.success) {
            validateForm(formData)
            return
        }
        try {
            const response = await editEducation(userId, formData)

            if (response) {
                console.log(" the response ", response.response.user)
                setProfileData(response.response.user)
            }

            onClose();

        } catch (error) {
            console.log("Error in the adding ", error)
        }

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
                onClick={onClose}
            />
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >
                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg ">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Edit Team</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} >
                            <div className="flex mt-6 flex-col">
                              

                        

                                <div className="grid grid-cols-2 mt-5 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-600">Postion*</label>
                                        {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                                        <input
                                            type="text"
                                            name="Postion"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-600">Name*</label>
                                        {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>
<GoPlus/>
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
        </div>
    );
}

export default EditEducation;
