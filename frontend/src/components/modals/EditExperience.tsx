import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { editExperience } from "../../services/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { data } from "react-router-dom";
import { Education } from "./AddEducation";
import { experinceSchema } from "../../validation/zod";


interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
    experienceId: string
}
export interface Experience {
    experienceId?:string;
    title: string;
    employmentType: string;
    company: string;
    startDate: string;
    endDate?: string;
    location: string;
    description: string;
    currentlyWorking?: boolean;
}


const EditExperience: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId, experienceId }) => {
    const [checked, setChecked] = useState(false);
    const user = useSelector((stae: RootState) => stae.auth.user)
    const experiences = user?.experiences

const [errors,setErrors]=useState<Record<string,string>>({})
    const firstExperienceId = experiences?.[0]?._id;
    const [formData, setFormData] = useState<Experience>({
        title: "",
        employmentType: "",
        company: "",
        startDate: "",
        endDate: "",
        location: "",
        description: "",
        currentlyWorking: false,
    });
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

  



   


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "startDate" || name === "endDate") {
            formattedValue = new Date(value).toISOString().split("T")[0];
        }
        setFormData((prev) => ({ ...prev, [name]: formattedValue }));
    };


       const validateForm = (data: Experience) => {
             const result = experinceSchema.safeParse(data)
             if (!result.success) {
                 const formattedErrors: Record<string, string> = {};
                 result.error.errors.forEach((err) => {
                     if (err.path) {
                         formattedErrors[err.path[0]] = err.message
                     }
                 })
                 setErrors(formattedErrors)
             }else{
                 setErrors({});
             }
     
         }


    const handleCheckboxChange = () => {
        setChecked(!checked);
        setFormData((prev) => ({
            ...prev,
            endDate: !checked ? "" : prev.endDate,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result= experinceSchema.safeParse(formData)
        if(!result.success){
            validateForm(formData)
            return
        }

        try {
            const experienceData: Experience = {
                ...formData,
                experienceId:firstExperienceId,
                currentlyWorking: checked
            };

      
            const response = await editExperience(userId, experienceData)
            console.log("Response from API:", response);
            if (response) {
                setProfileData((prev: any) => ({
                    ...prev,
                    experiences: prev.experiences.map((exp: Experience) =>
                        exp.experienceId === experienceId ? experienceData : exp
                    ),
                }));
                onClose();
            } else {
                console.log("No response received");
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
                        <h1 className="text-2xl font-medium">Edit Experience</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <form onSubmit={handleSubmit} >
                            <div className="flex mt-6 flex-col">
                                <div className="mt-5">
                                    <label className="text-gray-600">Title*</label>
                                    {errors.title && <p className="text-red-500">{errors.title}</p>}
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Retail Sales Manager"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Employment type*</label>
                                    {errors.employmentType && <p className="text-red-500">{errors.employmentType}</p>}
                                    <select
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        required
                                    >
                                        <option value="">Select Employment Type</option>
                                        <option value="Full time">Full-time</option>
                                        <option value="Part time">Part-time</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Intern">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Company or Organisation*</label>
                                    {errors.company && <p className="text-red-500">{errors.company}</p>}
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Microsoft"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={handleCheckboxChange}
                                            className="w-5 h-5 accent-orange-600 cursor-pointer"
                                        />
                                        <span className="text-gray-700 font-medium">{checked ? "Currently Working Here" : "Not Working Here"}</span>
                                    </label>
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
                                    {!checked && (
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
                                    )}
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Location*</label>
                                    {errors.location && <p className="text-red-500">{errors.location}</p>}
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Location"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-900">Description</label>
                                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400">
                                    </textarea>
                                </div>
                            </div>

                            <hr className="mt-9" />
                            <div className="flex relative justify-end p-6">
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

export default EditExperience;
