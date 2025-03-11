import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { editExperience } from "../../services/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";


interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
    experienceId: string
}
export interface Experience {
    _id?:string;
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
    console.log(experiences)

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
        if (isOpen && experienceId && experiences && experiences.length > 0) {
            const existingExperience = experiences.find((exp) => exp._id === experienceId);
            if (existingExperience) {
                setFormData((prevState) => ({
                    ...prevState,
                    title: existingExperience.title || "",
                    employmentType: existingExperience.employmentType || "",
                    company: existingExperience.company || "",
                    startDate: existingExperience.startDate || "",
                    endDate: existingExperience.endDate || "",
                    location: existingExperience.location || "",
                    description: existingExperience.description || "",
                    experienceId: experienceId,
                }));
                setChecked(existingExperience.currentlyWorking || false);
            }
        }
    }, [isOpen, experienceId, experiences]);



    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };



    const handleCheckboxChange = () => {
        setChecked(!checked);
        setFormData((prev) => ({
            ...prev,
            endDate: !checked ? "" : prev.endDate,
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        try {
            const experienceData: Experience = {
                ...formData,
                _id:experienceId,
                currentlyWorking: checked
            };

      
            const response = await editExperience(userId, experienceData)
            console.log("Response from API:", response);
            if (response) {
                setProfileData((prev: any) => ({
                    ...prev,
                    experiences: prev.experiences.map((exp: Experience) =>
                        exp._id === experienceId ? experienceData : exp
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
                                    <input
                                        type="text"
                                        name="employmentType"
                                        value={formData.employmentType}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Please Select"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Company or Organisation*</label>
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
                                        <input
                                            type="text"
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
                                            <input
                                                type="text"
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
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Please Select"
                                        required
                                    />
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-900">Description</label>
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
