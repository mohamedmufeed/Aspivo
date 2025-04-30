import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";

import { addEducation } from "../../../services/profile";
import { educationSchema } from "../../../validation/zod";





interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
}
export interface Education {
    _id?:string;
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
}


const AddEducation: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId }) => {
const [errors,setErrors]=useState<Record<string,string>>({})

    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: ""
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


    const validateForm =(data:Education)=>{
        const  result= educationSchema.safeParse(data)
        if(!result.success){
            const formattedErrors:Record<string,string>={};
            result.error.errors.forEach((err)=>{
                if(err.path){
                    formattedErrors[err.path[0]]=err.message
                }
            })

          setErrors(formattedErrors)
        }else{
            setErrors({})
        }
    }



    const handleSubmit = async (e: React.FormEvent) => {
 
        e.preventDefault();

        const result=educationSchema.safeParse(formData);
        if(!result.success){
            validateForm(formData)
            return
        }
        try {
            const educationData: Education = {
                ...formData,

            };
            const response = await addEducation(userId,formData)
        
            if (response) {

                setProfileData((prev: any) => ({
                    ...prev,
                    education: [...(prev.education || []), educationData]
                }));

                onClose();
            }
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
                        <h1 className="text-2xl font-medium">Add Education</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} >
                            <div className="flex mt-6 flex-col">
                                <div className="mt-5">
                                    <label className="text-gray-600">School*</label>
                                    {errors.school && <p className="text-red-500">{errors.school}</p>}
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Oxford"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Degree*</label>
                                    {errors.degree && <p className="text-red-500">{errors.degree}</p>}
                                    <input
                                        type="text"
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Bachelor of engineering"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Filed of study*</label>
                                    {errors.fieldOfStudy && <p className="text-red-500">{errors.fieldOfStudy}</p>}
                                    <input
                                        type="text"
                                        name="fieldOfStudy"
                                        value={formData.fieldOfStudy}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: mathematics, biology"
                                        required
                                    />
                                </div>



                                <div className="grid grid-cols-2 mt-5 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-600">Start date*</label>
                                        {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}
                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-600">End date*</label>
                                        {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}
                                        <input
                                            type="date"
                                            name="endDate"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>

                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Grade*</label>
                                    {errors.grade && <p className="text-red-500">{errors.grade}</p>}
                                    <input
                                        type="text"
                                        name="grade"
                                        value={formData.grade}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="%"
                                        required
                                    />
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

export default AddEducation;
