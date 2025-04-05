import React, { useEffect, useState } from "react";
import { VscClose } from "react-icons/vsc";
import { comapnyDescriptionSchema } from "../../../validation/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getComapny } from "../../../services/company/companyProfile";
import { editCompanyDescription } from "../../../services/company/companyProfile";
import { Bouncy } from "ldrs/react";

interface EditDescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyId: string;
    setCompanyData: (prev: any) => void
}

export interface FormData {
    description: string
}

const EditCompanyDescriptionModal: React.FC<EditDescriptionModalProps> = ({ setCompanyData, isOpen, onClose, companyId }) => {
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isOpen]);

    const [description, setDescription] = useState<string>("")


    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
        resolver: zodResolver(comapnyDescriptionSchema),
        defaultValues: {
            description: ""
        }
    });

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                const response = await getComapny(companyId)
                console.log(" the  company", response.company)
                const CompanyData = response.company;
                setValue("description", CompanyData.description || "");
            } catch (error) {
                console.error("Failed to fetch user profile", error);
            } finally {
                setLoading(false)
            }
        };

        if (isOpen && companyId) {
            fetchCompanyProfile();
        }
    }, [isOpen, companyId, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await editCompanyDescription(companyId, data)
            setCompanyData(response.comapny)
            onClose()
        } catch (error) {
            console.error("Profile update error:", error);
        } finally {
            setLoading(false)
        }

    }
    if (!isOpen) return null;

if(loading){
    return (
 
            <Bouncy size="45" speed="1.75" color="#FE4F00" />
    )
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
                        <h1 className="text-2xl font-medium"> Edit Company Profile </h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <form action="#" onSubmit={handleSubmit(onSubmit)}>



                        <div className="space-y-5 mt-8 px-7 flex flex-col">


                            <div className="flex flex-col">
                                <p className="mt-3 text-md text-gray-600">You can highlight your professional experience, expertise in the industry, and key skills. Many also choose to showcase their accomplishments or past roles.</p>
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                                <label htmlFor="description" className="block text-sm/6 font-medium text-gray-900"></label>
                                <div className="mt-2">
                                    <textarea    {...register("description")} name="description" id="description" value={description} rows={3} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-400 sm:text-sm/6" onChange={(e) => setDescription(e.target.value)}></textarea>
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

export default EditCompanyDescriptionModal