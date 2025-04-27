import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { Loader2 } from "lucide-react";
import { VscClose } from "react-icons/vsc";
import { generateResume } from "../../../services/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
interface Props{
    isOpen:boolean
    onClose:()=>void
}

 const  GenerateResumeModal:React.FC<Props>=({ isOpen, onClose })=> {
  const [step, setStep] = useState("info"); // 'info' | 'loading' | 'preview'
  const [resumeData, setResumeData] = useState(null);
const user=useSelector((state:RootState)=>state.auth.user)
const userId=user?._id||""
  const handleStart = async () => {
    setStep("loading");
    try {
     
      const response= await generateResume(userId)
      console.log("first", response)
      setResumeData(response.response);
      setStep("preview");
    } catch (error) {
      console.error("Error generating resume", error);
      setStep("info");
    }
  };

  const handleRegenerate = () => {
    handleStart();
  };

  const handleDownload = () => {
    const blob = new Blob([resumeData!], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "resume.txt";
    link.click();
  };

  const handleSetAsProfile = async () => {
    // Call backend API to upload resume
    console.log("Set as profile resume!");
    onClose();
  };

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl space-y-6">
            <div className="flex justify-between">
            <div className="text-2xl font-bold text-gray-800">AI Resume Generator</div>
            <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />  
            </div>
     
          {step === "info" && (
            <div className="space-y-4">
              <p className="text-gray-600">
                We will generate your resume using your profile information.
                <br />
                Please make sure your profile is complete before proceeding.
              </p>
              <div className="flex justify-end gap-2">
              <button className="bg-orange-600 text-white rounded-lg p-3" onClick={onClose}>Cancel</button>
              <button className="bg-orange-600 text-white rounded-lg p-3" onClick={handleStart}>Start Generating</button>
              </div>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-10">
              <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
              <p className="text-gray-600">Generating your resume... Please wait.</p>
            </div>
          )}

          {step === "preview" && resumeData && (
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto rounded-lg border p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap text-gray-800">{resumeData}</pre>
              </div>
              <div className="flex justify-end gap-2">
                <button className="bg-orange-600 text-white rounded-lg p-3" onClick={handleRegenerate}>Regenerate</button>
                <button className="bg-orange-600 text-white rounded-lg p-3" onClick={handleDownload}>Download</button>
                <button className="bg-orange-600 text-white rounded-lg p-3" onClick={handleSetAsProfile}>Set as My Profile Resume</button>
    
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default GenerateResumeModal