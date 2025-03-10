import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
}

const AddExperience: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId }) => {
    const [checked, setChecked] = useState(false);
    
    // State for form fields
    const [formData, setFormData] = useState({
        title: "",
        employmentType: "",
        company: "",
        startDate: "",
        endDate: "",
        locationType: "",
        description: ""
    });

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle checkbox toggle
    const handleCheckboxChange = () => {
        setChecked(!checked);
        setFormData((prev) => ({
            ...prev,
            endDate: checked ? prev.endDate : "", // Reset end date if checked
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProfileData((prev: any) => ({
            ...prev,
            experiences: [...(prev.experiences || []), { ...formData, currentlyWorking: checked }]
        }));
        onClose();
    };

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
                        <h1 className="text-2xl font-medium">Add Experience</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />

                    <form onSubmit={handleSubmit} className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
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
                                        placeholder="dd/mm/yy" 
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
                                            placeholder="dd/mm/yy" 
                                            required 
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="mt-5">
                                <label className="text-gray-600">Location type*</label>
                                <input 
                                    type="text" 
                                    name="locationType" 
                                    value={formData.locationType} 
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


             
                    </form>
                    <hr className="mt-9" />
                        <div className="flex justify-end p-6">
                            <button type="submit" className="p-3 px-5 bg-orange-600 rounded-lg text-white font-bold">
                                Save Changes
                            </button>
                        </div>
                </div>
            </div>
        </div>
    );
}

export default AddExperience;
