import React, { useState } from "react";
import { VscClose } from "react-icons/vsc";
import { GoPlus } from "react-icons/go";
interface PostModalProps {
    onClose: () => void;
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

    const handleSkillChange = (index: number, value: string) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = value;
        setSkills(updatedSkills);
    };

    const addSkill = () => {
        setSkills([...skills, ""]);
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

                        <form >
                            <div className="flex mt-6 flex-col">
                                <h3 className="font-medium">This information will displayed publicly </h3>
                                <div className="mt-5">
                                    <label className="text-gray-600">Job title*</label>
                                    {/* {errors.title && <p className="text-red-500">{errors.title}</p>} */}
                                    <input
                                        type="text"
                                        name="title"
                                        //   value={formData.title}
                                        //   onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: Software Engineer "
                                        required
                                    />
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
                                                    className="w-5 h-5 accent-orange-600"
                                                    value={type}
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-5 ">
                                    <label className="text-gray-600">Salary*</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <input
                                                type="text"
                                                name="company"
                                                //   value={formData.company}
                                                //   onChange={handleChange}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Minimum salary"
                                                required
                                            />
                                        </div>
                                        <div className=" flex flex-col">
                                            <input
                                                type="text"
                                                name="company"
                                                //   value={formData.company}
                                                //   onChange={handleChange}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Maximum salary"
                                                required
                                            />
                                        </div>

                                    </div>
                                    {/* {errors.company && <p className="text-red-500">{errors.company}</p>} */}


                                </div>





                                <div className="mt-5">
                                    <label className="text-gray-600">Category* <span className="text-black">(You can select only one job category)</span></label>

                                    <select
                                        name="category"
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        required
                                    >
                                        <option value="">Select Job Category</option>
                                        {jobCategories.map((category) => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>




                                <div className="mt-5">
                                    <label className="text-gray-600">Slots* <span className="text-black">(At least one 1 slot )</span> </label>
                                    {/* {errors.title && <p className="text-red-500">{errors.title}</p>} */}
                                    <input
                                        type="text"
                                        name="title"
                                        //   value={formData.title}
                                        //   onChange={handleChange}
                                        className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                        placeholder="Ex: 20 "
                                        required
                                    />
                                </div>



                                <div className="grid grid-cols-2 mt-5 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-gray-600">Start date*</label>
                                        {/* {errors.startDate && <p className="text-red-500">{errors.startDate}</p>} */}
                                        <input
                                            type="date"
                                            name="startDate"
                                            // value={formData.startDate}
                                            // onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="text-gray-600">End date*</label>
                                        {/* {errors.endDate && <p className="text-red-500">{errors.endDate}</p>} */}
                                        <input
                                            type="date"
                                            name="endDate"
                                            // value={formData.endDate}
                                            // onChange={handleChange}
                                            className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                            placeholder="YYYY-MM-DD"
                                            required
                                        />
                                    </div>

                                </div>



                                <div className="mt-5 ">
                                    <label className="text-gray-600">Required Skills</label>
                                    {skills.map((skill, index) => (
                                        <div key={index} className="flex items-center mt-2">
                                            <input
                                                type="text"
                                                value={skill}
                                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                                className="border p-2 w-full rounded-lg focus:outline-orange-400"
                                                placeholder="Ex: Communication"
                                            />
                                            {index === skills.length - 1 && (
                                                <div className="p-5">
                                                    <GoPlus className="w-6 h-6 " onClick={addSkill} />
                                                </div>

                                            )}
                                        </div>
                                    ))}
                                </div>



                                <div className="mt-5">
                                    <label className="block text-gray-600">Job description</label>
                                    {/* {errors.description && <p className="text-red-500">{errors.description}</p>} */}
                                    <textarea
                                    placeholder="Enter job description"
                                        name="job description"
                                        //   value={formData.description}
                                        //   onChange={handleChange}
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400">
                                    </textarea>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Qualification</label>
                                    {/* {errors.description && <p className="text-red-500">{errors.description}</p>} */}
                                    <textarea
                                    placeholder="Enter the qualification"
                                        name="qualification"
                                        //   value={formData.description}
                                        //   onChange={handleChange}
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400">
                                    </textarea>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Job responsibilities</label>
                                    {/* {errors.description && <p className="text-red-500">{errors.description}</p>} */}
                                    <textarea
                                    placeholder="Enter the job responsibities"
                                        name="job responsibities"
                                        //   value={formData.description}
                                        //   onChange={handleChange}
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400">
                                    </textarea>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-gray-600">Requirements</label>
                                    {/* {errors.description && <p className="text-red-500">{errors.description}</p>} */}
                                    <textarea

                                        name="job requirements"
                                        placeholder="Enter Job requirements"
                                        //   value={formData.description}
                                        //   onChange={handleChange}
                                        rows={3}
                                        className="block w-full border p-2 rounded-lg focus:outline-orange-400">
                                    </textarea>
                                </div>


                            </div>


                            <div className="  ">
                                <hr className="mt-9" />
                                <div className="flex  justify-end p-6">
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
    )
}

export default PostJobModal