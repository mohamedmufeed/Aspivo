import React, { useState, useEffect } from "react";
import { VscClose } from "react-icons/vsc";
import ToastError from "../../Tost/ErrorToast";
import { z } from "zod";
import { addTechStack, getComapny } from "../../../services/company/companyProfile";
import { ICompanyType } from "../../../types/types";



const techStackSchema = z.object({
  stack: z.array(
       z
      .string()
      .min(1, "Tech stack item cannot be empty")
  ),
})

interface AddTechStackModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyId: string;
    initialTechStack: string[]|undefined;
    setCompanyData: (data: any ) => void;
}

const AddTechStackModal: React.FC<AddTechStackModalProps> = ({
    isOpen,
    onClose,
    companyId,
    initialTechStack,
    setCompanyData,
}) => {
    const [techStack, setTechStack] = useState<string[]>(initialTechStack || []);
    const [techStackInput, setTechStackInput] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    useEffect(() => {
        setTechStack(initialTechStack || []);
    }, [initialTechStack, isOpen]);

    const addTechStackToList = (tech: string) => {
        if (tech.trim()) {
            const isDuplicate = techStack.some(
                (item) => item.toLowerCase() === tech.trim().toLowerCase()
            );
            if (isDuplicate) {
                setError("This tech stack item already exists.");
                return;
            }
            setTechStack([...techStack, tech.trim()]);
            setTechStackInput(""); 
        }
    };

    const removeTechStack = (techToRemove: string) => {
        setTechStack(techStack.filter((tech) => tech !== techToRemove));
    };

    const validateForm = () => {
        const result = techStackSchema.safeParse({ stack: techStack });
        if (!result.success) {
            const formattedErrors: Record<string, string> = {};
            result.error.errors.forEach((err) => {
                formattedErrors.stack = err.message;
            });
            setErrors(formattedErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (techStackInput.trim()) {
            addTechStackToList(techStackInput);
            return;
        }
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            const currentCompany = await getComapny(companyId);
            const updatedData = {
                ...currentCompany,
                stack: techStack, 
            };

            const response = await addTechStack(companyId, updatedData);
            console.log("Tech stack updated successfully:", response);
            setCompanyData((prev: ICompanyType | undefined) => {
                if (!prev) return prev; 
                
                return {
                    ...prev, 
                    stack: techStack, 
                };
            });
            

            onClose();
        } catch (error) {
            const err= error as Error
            console.error("Error updating tech stack:", error);
            setError(err.message || "Failed to update tech stack. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {error && <ToastError message={error} onClose={() => setError(null)} />}
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
                        <h1 className="text-2xl font-medium">Add Tech Stack</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />

                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <div className="bg-white flex flex-wrap gap-2">
                            {techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-2 bg-orange-200 text-gray-700 rounded-full text-sm font-medium flex items-center"
                                >
                                    {tech}
                                    <VscClose
                                        className="ml-2 cursor-pointer hover:text-red-600"
                                        onClick={() => removeTechStack(tech)}
                                    />
                                </span>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="flex mt-6 flex-col">
                                <div className="mt-5">
                                    <label className="text-gray-600">Tech Stack*</label>
                                    {errors.stack && (
                                        <p className="text-red-500">{errors.stack}</p>
                                    )}
                                    <input
                                        type="text"
                                        value={techStackInput}
                                        onChange={(e) => setTechStackInput(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter" && techStackInput.trim()) {
                                                e.preventDefault();
                                                addTechStackToList(techStackInput);
                                            }
                                        }}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Enter a tech stack (e.g., React)"
                                        disabled={isSaving}
                                    />
                                </div>
                            </div>

                            <hr className="mt-9" />
                            <div className="flex justify-end p-6">
                                <button
                                    type="submit"
                                    className={`p-3 px-5 rounded-lg text-white font-bold ${
                                        (techStackInput.trim() || techStack.length > 0) && !isSaving
                                            ? "bg-orange-600 hover:bg-orange-700"
                                            : "bg-gray-400 cursor-not-allowed"
                                    }`}
                                    disabled={
                                        (!techStackInput.trim() && techStack.length === 0) || isSaving
                                    }
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : techStackInput.trim()
                                        ? "Add Tech Stack"
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

export default AddTechStackModal;