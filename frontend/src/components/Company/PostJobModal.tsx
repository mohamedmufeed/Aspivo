import React, { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { GoPlus } from "react-icons/go";
import { JobData, postJob } from "../../services/company/compayprofile";
import { jobSchema } from "../../validation/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";



interface PostModalProps {
    onClose: () => React.Dispatch<React.SetStateAction<JobData[] | undefined>>;
}

const PostJobModal: React.FC<PostModalProps> = ({ onClose }) => {
    const jobCategories = [
        "Software Development",
        "Design",
        "Marketing",
        "Sales",
        "Human Resources",
        "Customer Support",
        "Finance",
        "Healthcare",
        "Education",
        "Construction",
        "Logistics",
        "Legal",
        "Administrative"
    ];

    const [skills, setSkills] = useState<string[]>([""]);
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            jobTitle: "",
            category: "",
            typesOfEmployment: [],
            minimumSalary: "",
            maximumSalary: "",
            startDate: "",
            endDate: "",
            slot: "",
            requiredSkills: [""],
            jobDescription: "",
            qualification: "",
            jobResponsibilities: "",
            requirements: ""
        }
    });

    const handleSkillChange = (index: number, value: string) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        setSkills(updatedSkills);
        setValue("requiredSkills", updatedSkills);
    };

    const addSkill = () => {
        setSkills([...skills, ""]);
        setValue("requiredSkills", [...skills, ""]);
    };
    const company= useSelector((state:RootState)=>state.companyauth.company)


    const companyId=company?._id||""
    const onSubmit = async (data: any) => {
        try {
     
            const submitData = {
                ...data,
                minimumSalary: Number(data.minimumSalary),
                maximumSalary: Number(data.maximumSalary),
                slot: Number(data.slot)
            };
            window.location.reload()
          const response= await postJob(companyId,submitData)
          console.log(response)
            onClose();
        } catch (error) {
            console.error("Error posting job:", error);
        }
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
                        <h1 className="text-2xl font-medium">Post Job</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <div className="px-7 space-y-10 max-h-[70vh] overflow-y-auto">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex mt-6 flex-col">
                                <h3 className="font-medium">This information will be displayed publicly</h3>
                                
                                <div className="mt-5">
                                    <label className="text-gray-600">Job title*</label>
                                    <input
                                        {...register("jobTitle")}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Software Engineer"
                                    />
                                    {errors.jobTitle && <p className="text-red-500">{errors.jobTitle.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">
                                        Type of employment <span className="text-black">(You can select multiple)</span>
                                    </label>
                                    <div className="grid grid-cols-5 gap-4 mt-3">
                                        {["Full-time", "Part-time", "Remote", "Internship", "Contract"].map((type) => (
                                            <label key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    {...register("typesOfEmployment")}
                                                    value={type}
                                                    className="w-5 h-5 accent-orange-600"
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.typesOfEmployment && <p className="text-red-500">{errors.typesOfEmployment.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Salary*</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <input
                                                {...register("minimumSalary")}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Minimum salary"
                                            />
                                            {errors.minimumSalary && <p className="text-red-500">{errors.minimumSalary.message}</p>}
                                        </div>
                                        <div className="flex flex-col">
                                            <input
                                                {...register("maximumSalary")}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Maximum salary"
                                            />
                                            {errors.maximumSalary && <p className="text-red-500">{errors.maximumSalary.message}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Category* <span className="text-black">(You can select only one job category)</span></label>
                                    <select
                                        {...register("category")}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                    >
                                        <option value="">Select Job Category</option>
                                        {jobCategories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500">{errors.category.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Slots* <span className="text-black">(At least one slot)</span></label>
                                    <input
                                        {...register("slot")}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: 20"
                                    />
                                    {errors.slot && <p className="text-red-500">{errors.slot.message}</p>}
                                </div>

                                <div className="grid grid-cols-2 mt-5 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-600">Start date*</label>
                                        <input
                                            type="date"
                                            {...register("startDate")}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        />
                                        {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-gray-600">End date*</label>
                                        <input
                                            type="date"
                                            {...register("endDate")}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        />
                                        {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="text-gray-600">Required Skills</label>
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <input
                                                {...register(`requiredSkills.${index}`)}
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Ex: Communication"
                                            />
                                            {index === skills.length - 1 && (
                                                <div className="p-5">
                                                    <GoPlus className="w-6 h-6" onClick={addSkill} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {errors.requiredSkills && <p className="text-red-500">{errors.requiredSkills.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Job description</label>
                                    <textarea
                                        {...register("jobDescription")}
                                        placeholder="Enter job description"
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400"
                                    />
                                    {errors.jobDescription && <p className="text-red-500">{errors.jobDescription.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Qualification</label>
                                    <textarea
                                        {...register("qualification")}
                                        placeholder="Enter the qualification"
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400"
                                    />
                                    {errors.qualification && <p className="text-red-500">{errors.qualification.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Job responsibilities</label>
                                    <textarea
                                        {...register("jobResponsibilities")}
                                        placeholder="Enter the job responsibilities"
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400"
                                    />
                                    {errors.jobResponsibilities && <p className="text-red-500">{errors.jobResponsibilities.message}</p>}
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Requirements</label>
                                    <textarea
                                        {...register("requirements")}
                                        placeholder="Enter Job requirements"
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400"
                                    />
                                    {errors.requirements && <p className="text-red-500">{errors.requirements.message}</p>}
                                </div>
                            </div>

                            <div>
                                <hr className="mt-9" />
                                <div className="flex justify-end p-6">
                                    <button type="submit" className="p-3 px-5 bg-orange-600 rounded-lg text-white font-bold">
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJobModal;