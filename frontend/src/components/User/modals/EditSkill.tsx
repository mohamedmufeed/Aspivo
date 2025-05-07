import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { addSkill } from "../../../services/profile"; 
import { z } from "zod";



const skillSchema = z.object({
    skills: z.array(z.string().min(1, "Skill cannot be empty")),
});

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
}

const EditSkill: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    userId,
    setProfileData,
}) => {
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);


    const addSkillToList = () => {
        if (skillInput.trim() && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput.trim()]);
            setSkillInput("");
        }
    };


    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter((skill) => skill !== skillToRemove));
    };


    const validateForm = () => {
        const result = skillSchema.safeParse({ skills });
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                formattedErrors.skills = err.message;
            });
            setErrors(formattedErrors);
            return false;
        }
        setErrors({});
        return true;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
    
             await addSkill(userId, skills);
            setProfileData((prev: any) => ({
                ...prev,
                skills: [...(prev.skills || []), ...skills],
            }));

            onClose();
        } catch (error) {
            console.log("Error adding skill:", error);
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
                        <h1 className="text-2xl font-medium">Edit Skill</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />



                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">

                        <div className="bg-white ">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-2 w-20 bg-orange-200 text-gray-700 rounded-full text-sm font-medium flex items-center"
                                >
                                    {skill}
                                    <VscClose
                                        className="ml-2 cursor-pointer hover:text-red-600"
                                        onClick={() => removeSkill(skill)}
                                    />
                                </span>
                            ))}

                        </div>

                        <form onSubmit={handleSubmit} >
                            <div className="flex mt-6 flex-col">
                                <div className="mt-5">
                                    <label className="text-gray-600">School*</label>
                                    {errors.skill && <p className="text-red-500">{errors.skill}</p>}
                                    <input
                                        type="text"
                                        name="skill"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Oxford"
                                        required
                                    />
                                </div>
                            </div>

                            <hr className="mt-9" />
                            <div className="flex justify-end p-6">
                                <button
                                    type="submit"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (skillInput.trim()) {
                                            addSkillToList();
                                        } else if (skills.length > 0) {
                                            handleSubmit(e);
                                        }
                                    }}
                                    className={`p-3 px-5 rounded-lg text-white font-bold ${skillInput.trim() || skills.length > 0
                                            ? "bg-orange-600 hover:bg-orange-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={!skillInput.trim() && skills.length === 0}
                                >
                                    {skillInput.trim() ? "Add Skill" : "Save Changes"}
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditSkill;
