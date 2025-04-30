
import { AiOutlineDelete } from 'react-icons/ai'
import { BsDownload } from 'react-icons/bs'
import { CiStickyNote } from 'react-icons/ci'
import { IoCloudUploadOutline } from 'react-icons/io5'
import { useDropzone } from "react-dropzone"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { deleteResume, getProfile, uploadResume } from '../../../services/profile'
import GenerateResumeModal from '../modals/GenerateResumeModal'
import ToastError from '../../Tost/ErrorToast'
import { FaWandMagicSparkles } from "react-icons/fa6";

interface ResumeModalProps {
    userId: string,
    setProfileData: (prev: any) => void,
}

const Resume: React.FC<ResumeModalProps> = ({ userId, setProfileData }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [fileUrl, setFileUrl] = useState("")
    const [resumeurl, setResumeUrl] = useState("")
    const [generateResumeModal, setgenerateResumeModal] = useState(false)
    const [aiFeatures, setAiFeatures] = useState(false)
     const [error,setError]=useState<string|null>(null)
const [successMessage, setSuccessMessage]=useState("")
    const uploadToCloudinary = async (file: File) => {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "Aspivo");
        try {
            const { data } = await axios.post(`https://api.cloudinary.com/v1_1/do4wdvbcy/upload`, formData)
            console.log(data.secure_url)
            setFileUrl(data.secure_url)
            setUploading(false)

        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
        }

    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            "application/pdf": [".pdf"],
            "image/jpeg": [".jpeg", ".jpg"],
        },
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                setSelectedFile(file);
                uploadToCloudinary(file)
            }
        },
    });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setSuccessMessage("")
        e.preventDefault()
        if (!fileUrl) {
            console.error("No file uploaded yet");
            return;
        }
        try {

            const response = await uploadResume(userId, fileUrl)
            setProfileData(response.response?.user)
            setSuccessMessage("Resume uploaded successfully!");
        } catch (error) {
            setSuccessMessage("Resume upload failed. Please try again.");
            console.error("Error submitting resume:", error);
        }
    }

    const getDownloadableLink = (resumeUrl: string) => {
        return resumeUrl.replace("/upload/", "/upload/fl_attachment:");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile(userId);
                console.log("the user resposen", response.user.user.features)
                setResumeUrl(response.user.user.resume)
                if (response.user.user.features.unlockAiFeatures) {
                    setAiFeatures(true)
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfile();
    }, [userId, location]);


    const handleDelete = async () => {
        const response = await deleteResume(userId)
        setProfileData(response.response.user)
        setResumeUrl("")
    }

    const handleAiFeature = () => {
        if (aiFeatures) {
            setgenerateResumeModal(true)
        } else {
            setError("Please subscribe to unlock AI features.")
            return
        }
    }


    return (
        <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
            <div className='flex justify-center'>
            {error?  <ToastError message={error||""} onClose={()=>setError(null)}/>:""}
            </div>
          
          
            <div className="flex justify-between px-8">
                <h1 className="font-medium text-2xl">Resume</h1>
            </div>
            <div
                className="flex justify-end mt-3 mr-5 cursor-pointer"
                onClick={handleAiFeature}
            >
                <h1
                    className={`text-md font-medium hover:underline mr-12 flex space-x-2.5 ${aiFeatures ? 'text-black' : 'text-gray-400 cursor-not-allowed'}`}
                    aria-disabled={!aiFeatures}
                >
                <FaWandMagicSparkles  className='w-5 h-5 '/> AI-Optimized  <span className={aiFeatures ? 'text-orange-600' : 'text-orange-200'}> Resume</span>
                </h1>


            </div>
            {generateResumeModal ? <GenerateResumeModal setProfileData={setProfileData} onClose={() => setgenerateResumeModal(false)} /> : ""}

            <div className="flex mx-auto w-3/4 bg-white h-[60px] items-center shadow-gray-200 shadow-lg rounded-md justify-between px-6 mt-4">
                <div className="flex items-center space-x-4">
                    <CiStickyNote className="w-6 h-6 text-gray-600" />
                    <p className="text-gray-700">{resumeurl ? "Resume.pdf" : " Please Upload Resume"}</p>
                </div>
                <div className="flex space-x-6">
                    <BsDownload className={`w-6 h-6 text-gray-600  hover:text-gray-800 ${resumeurl ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
                        }`} onClick={(e) => {
                            if (!resumeurl) {
                                e.preventDefault()
                                return
                            } window.open(getDownloadableLink(resumeurl), "_blank")
                        }} />
                    <AiOutlineDelete className={`w-6 h-6 text-gray-600  hover:text-gray-800 ${resumeurl ? " cursor-pointer" : "opacity-50 cursor-not-allowed"
                        }`} onClick={handleDelete} />
                </div>
            </div>



            <div {...getRootProps()} className={`w-5/6 mx-auto mt-5 p-6 flex flex-col items-center justify-center cursor-pointer rounded-lg outline-1.5 px-6 outline-dashed ${isDragActive ? "bg-gray-100" : ""}`}>
                <input {...getInputProps()} />
                <IoCloudUploadOutline className="w-8 h-8 text-gray-900 mb-2 " />
                <h2 className="font-bold text-md text-gray-700 text-center">
                    {isDragActive ? "Drop the file here" : "Drag and Drop file here or "}
                    <span className="text-orange-600 cursor-pointer">
                        Choose File
                    </span>
                </h2>
             
                <p className="mt-2 text-sm text-gray-500">
                    Supported Formats: PDF, JPEG ,JPG ,PNG
                </p>
                <p className='text-gray-800 '>{successMessage}</p>
                <div>
                    {selectedFile && (
                        <p className="mt-3 text-sm text-gray-700">{selectedFile.name}</p>
                    )}
                </div>


            </div>

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={uploading || !fileUrl}
                    className={`font-semibold px-6 py-3 rounded-lg text-white transition-all 
      ${uploading || !fileUrl ? "bg-gray-400 cursor-not-allowed" : "bg-orange-600 hover:bg-orange-700"}
    `}
                >
                    {uploading ? "Uploading..." : "Save Changes"}
                </button>
            </div>
        </div>
    )
}

export default Resume