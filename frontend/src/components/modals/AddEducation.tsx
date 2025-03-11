import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { useDispatch } from "react-redux";



interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
}
 export interface Education {
    school: string;
    degree:string;
    filedofstudy: string;
    startDate: string;
    endDate: string; 
    grade: string;
  }
  

const AddEducation: React.FC<EditProfileModalProps> = ({ setProfileData, isOpen, onClose, userId }) => {

    const dispatch = useDispatch();
   
    const [formData, setFormData] = useState({
        school: "",
        degree: "",
        filedofstudy: "",
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
  

  

 
    const handleSubmit = async (e: React.FormEvent) => {
        console.log("clicked")
        e.preventDefault();


        try {
            const experienceData: Education = {
                ...formData, 
            
            };
          
             if(true){
          
               setProfileData((prev: any) => ({
                ...prev,
                experiences: [...(prev.experiences || []), experienceData] 
            }));

            onClose();
             }

    
        } catch (error) {
            console.log("Error in the adding ",error)
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
                                <input 
                                    type="text" 
                                    name="school" 
                                    value={formData.school} 
                                    onChange={handleChange} 
                                    className="border p-2 w-full rounded-lg focus:outline-orange-400" 
                                    placeholder="Ex: Retail Sales Manager" 
                                    required 
                                />
                            </div>

                            <div className="mt-5">
                                <label className="text-gray-600">Degree*</label>
                                <input 
                                    type="text" 
                                    name="degree" 
                                    value={formData.degree} 
                                    onChange={handleChange} 
                                    className="border p-2 w-full rounded-lg focus:outline-orange-400" 
                                    placeholder="Please Select" 
                                    required 
                                />
                            </div>

                            <div className="mt-5">
                                <label className="text-gray-600">Filed of study*</label>
                                <input 
                                    type="text" 
                                    name="filedofstudy" 
                                    value={formData.filedofstudy} 
                                    onChange={handleChange} 
                                    className="border p-2 w-full rounded-lg focus:outline-orange-400" 
                                    placeholder="Ex: Microsoft" 
                                    required 
                                />
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
                           
                            </div>

                            <div className="mt-5">
                                <label className="text-gray-600">Grade*</label>
                                <input 
                                    type="text" 
                                    name="grade" 
                                    value={formData.grade} 
                                    onChange={handleChange} 
                                    className="border p-2 w-full rounded-lg focus:outline-orange-400" 
                                    placeholder="Please Select" 
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
