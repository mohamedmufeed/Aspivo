import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VscClose } from "react-icons/vsc";
import { editCompanyProfileSchema, } from "../../../validation/zod";
import axios from "axios";
import { editCompanyProfile,getComapny } from "../../../services/company/companyProfile";
import ToastError from "../../Tost/ErrorToast";


interface EditCompanyProfileForm {
    companyName: string;
    companyUrl: string;
    industry: string;
    startDate: string;
    employees: string;
    location: string;
}

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    companyId: string;
    setCompanyData:(data:any)=>void
    
}

const EditCompanyProfileModal: React.FC<EditProfileModalProps> = ({ setCompanyData,isOpen, onClose, companyId }) => {
    const [loading, setLoading] = useState(false);
    const [logoUrl, setLogoUrl] = useState<string | null>(null); 
    const [imageError, setImageError] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<EditCompanyProfileForm>({
        resolver: zodResolver(editCompanyProfileSchema),
        defaultValues: {
            companyName: "",
            companyUrl: "",
            industry: "",
            startDate: "",
            employees: "",
            location: "",
        },
    });

    useEffect(() => {
        const fetchCompanyProfile = async () => {
            try {
                setLoading(true);
                const response = await getComapny(companyId);
                console.log("fkrfm",response)
                const companyData = response.company;

                setValue("companyName", companyData.companyName || "");
                setValue("companyUrl", companyData.companyUrl || "");
                setValue("startDate", companyData.startDate || "");
                setValue("employees", companyData.employees || "");
                setValue("location", companyData.location || "");
                setValue("industry", companyData.industry || "");
                setLogoUrl(companyData.logo || null); 
            } catch (error) {
                console.error("Failed to fetch company profile", error);
                setErrorMessage("Failed to load company profile. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && companyId) {
            fetchCompanyProfile();
        }
    }, [isOpen, companyId, setValue]);

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const uploadedImageUrl = await uploadToCloudinary(file);
            if (uploadedImageUrl) {
                setLogoUrl(uploadedImageUrl);
                setImageError(null);
            }
        }
    };

    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Aspivo");

        try {
            const { data } = await axios.post(
                `https://api.cloudinary.com/v1_1/do4wdvbcy/image/upload`,
                formData
            );
            console.log("Image uploaded successfully:", data.secure_url);
            return data.secure_url;
        } catch (error) {
            console.error("Error uploading image:", error);
            setImageError("Failed to upload image. Please try again.");
            return null;
        }
    };

    const onSubmit = async (data: EditCompanyProfileForm) => {
        try {
            setLoading(true);
            setErrorMessage(null);

   
            const startDate = new Date(data.startDate);
            if (isNaN(startDate.getTime())) {
                throw new Error("Invalid start date");
            }

            const formattedData = {
                ...data,
                startDate: startDate.toISOString(),
                logo: logoUrl || "",
            };
         
            console.log("Sending data to backend:", formattedData); 

            const response = await editCompanyProfile(companyId, formattedData);
            setCompanyData(response.company)
            console.log("Profile updated successfully:", response.company);

            onClose();
        } catch (error: any) {
            console.error("Profile update error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to update company profile. Please try again.";
            setErrorMessage(errorMessage);
        } finally {
            setLoading(false);
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
                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Edit Company Profile</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex bg-white shadow-lg rounded-lg w-5/6 mx-auto mt-5 p-9">
                            <div className="relative bg-gray-300 rounded-full w-32 h-32 flex items-center justify-center overflow-hidden">
                                {logoUrl ? (
                                    <img
                                        src={logoUrl}
                                        alt="Company Logo"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-600">Upload</span>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="flex flex-col items-start pl-8 mt-9">
                                <h3 className="font-semibold text-lg">Upload Logo</h3>
                                <p className="text-gray-500 text-sm">At least 800 × 800 px recommended.</p>
                            </div>
                        </div>
                        {imageError && <p className="text-red-500 text-center">{imageError}</p>}

                        <h2 className="font-medium text-lg pl-5 mt-6">Information</h2>
                        <div className="space-y-5 mt-8 px-7 flex flex-col">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="companyName">Company Name</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        {...register("companyName")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.companyName && <p className="text-red-500">{errors.companyName.message}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="companyUrl">Company URL</label>
                                    <input
                                        type="text"
                                        id="company-url"
                                        {...register("companyUrl")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.companyUrl && <p className="text-red-500">{errors.companyUrl.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="startDate">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        {...register("startDate")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="employees">Employees</label>
                                    <input
                                        type="text"
                                        id="employees"
                                        {...register("employees")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.employees && <p className="text-red-500">{errors.employees.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label htmlFor="location">Location</label>
                                    <input
                                        type="text"
                                        id="location"
                                        {...register("location")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.location && <p className="text-red-500">{errors.location.message}</p>}
                                </div>
                                <div className="flex flex-col">
                                    <label htmlFor="industry">Industry</label>
                                    <input
                                        type="text"
                                        id="industry"
                                        {...register("industry")}
                                        className="border p-2 w-full rounded-lg"
                                    />
                                    {errors.industry && <p className="text-red-500">{errors.industry.message}</p>}
                                </div>
                            </div>
                        </div>
                        <hr className="mt-9" />
                        <div className="flex justify-end p-6">
                            <button
                                type="submit"
                                className="p-3 px-5 bg-orange-600 rounded-lg text-white font-bold disabled:opacity-50"
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                    {errorMessage && <ToastError message={errorMessage} onClose={() => setErrorMessage(null)} />}
                </div>
            </div>
        </div>
    );
};

export default EditCompanyProfileModal;