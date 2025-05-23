import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { addSkill } from "../../../services/profile";
import { z } from "zod";
import { getSkills } from "../../../services/adminService";
import ToastError from "../../Tost/ErrorToast";


const skillSchema = z.object({
    skills: z.array(z.string().min(1, "Skill cannot be empty")),
});

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    setProfileData: (prev: any) => void;
    existingSkill: any
}

interface SkillType {
    name: string;
}

const AddSkill: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    userId,
    setProfileData,
}) => {
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [sugesstionSkill, setSugesstionSkill] = useState<SkillType[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<SkillType[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const fetchSkills = async () => {
        try {
            const response = await getSkills();
            setSugesstionSkill(response.skills);
        } catch (error) {
            console.error("Error in fetching skills",error);
        }
    };


    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);
    useEffect(() => {
        if (skillInput.trim()) {
            const filtered = sugesstionSkill.filter((skill) =>
                skill.name.toLowerCase().includes(skillInput.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setFilteredSuggestions([]);
            setShowSuggestions(false);
        }
    }, [skillInput, sugesstionSkill]);

    const addSkillToList = (skill: string) => {
        if (skill.trim() && !skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
            setSkills([...skills, skill.trim()]);
            setSkillInput("");
            setShowSuggestions(false);
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
        if (skillInput.trim()) {
            addSkillToList(skillInput);
            return;
        }
        if (!validateForm()) return;

        if (skills.length === 0) {
            setErrors({ skills: "Please add at least one skill before saving." });
            return;
        }

        setIsSaving(true);
        try {
            const response = await addSkill(userId, skills);
            if (response.status === 400) {
                setError("Skill alredy exits")
                return
            }else{
                setProfileData((prev: any) => ({
                    ...prev,
                    skills: [...(prev.skills || []), ...skills],
                }));
                onClose();
            }
     
      
        } catch (error) {
            console.error("Error adding skill:", error);
            setErrors({ skills: "Failed to save skills. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {error ? <ToastError message={error} onClose={() => setError(null)} /> : ""}
            <div
                className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
                onClick={onClose}
            />
            <div
                className="fixed inset-0 flex items-center justify-center z-50"
                style={{ fontFamily: "DM Sans, sans-serif" }}
            >

                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Add Skill</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />

                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <div className="bg-white flex flex-wrap gap-2">
                            {skills.map((skill) => (
                                <span
                                    key={skill}
                                    className="px-3 py-2 bg-orange-200 text-gray-700 rounded-full text-sm font-medium flex items-center"
                                >
                                    {skill}
                                    <VscClose
                                        className="ml-2 cursor-pointer hover:text-red-600"
                                        onClick={() => removeSkill(skill)}
                                    />
                                </span>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex mt-6 flex-col">
                                <div className="mt-5 relative">
                                    <label className="text-gray-600">Skill*</label>
                                    {errors.skills && (
                                        <p className="text-red-500">{errors.skills}</p>
                                    )}
                                    <input
                                        type="text"
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() =>
                                            setTimeout(() => setShowSuggestions(false), 200)
                                        }
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" && skillInput.trim()) {
                                                e.preventDefault();
                                                addSkillToList(skillInput);
                                            }
                                        }}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Type or select a skill"
                                    />
                                    {showSuggestions && filteredSuggestions.length > 0 && (
                                        <ul className="absolute z-10 bg-white border rounded-lg w-full mt-1 max-h-40 overflow-y-auto shadow-lg">
                                            {filteredSuggestions.map((skill, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 hover:bg-orange-100 cursor-pointer"
                                                    onClick={() => addSkillToList(skill.name)}
                                                >
                                                    {skill.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <hr className="mt-9" />
                            <div className="flex justify-end p-6">
                                <button
                                    type="submit"
                                    className={`p-3 px-5 rounded-lg text-white font-bold ${(skillInput.trim() || skills.length > 0) && !isSaving
                                        ? "bg-orange-600 hover:bg-orange-700"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    disabled={
                                        (!skillInput.trim() && skills.length === 0) || isSaving
                                    }
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : skillInput.trim()
                                            ? "Add Skill"
                                            : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSkill;