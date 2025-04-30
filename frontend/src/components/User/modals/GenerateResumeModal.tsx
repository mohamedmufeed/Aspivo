import React, {  useState } from "react";
import { Loader2 } from "lucide-react";
import { VscClose } from "react-icons/vsc";
import { generateResume, uploadResume } from "../../../services/profile";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { IUser } from "../../../types/types";
import axios from "axios";
import { GoPencil } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import { CiRedo } from "react-icons/ci";

interface Props {
  onClose: () => void;
  setProfileData: (prev: IUser) => void,
}

const GenerateResumeModal: React.FC<Props> = ({ onClose, setProfileData }) => {
  const [step, setStep] = useState("info");
  const [resumeData, setResumeData] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableResume, setEditableResume] = useState<string>("");
  const [uploading, setUploading] = useState(false)

  const user = useSelector((state: RootState) => state.auth.user);
  const userId = user?._id || "";

  const handleStart = async () => {
    setStep("loading");
    try {
      const response = await generateResume(userId);
      const resumeText = response.response;
      setResumeData(resumeText);
      setEditableResume(resumeText);
      setStep("preview");
    } catch (error) {
      console.error("Error generating resume", error);
      setStep("info");
    }
  };

  const handleRegenerate = () => {
    handleStart();
  };

  const handleDownload = async () => {
    try {

      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule as any;


      const element = document.createElement("div");
      element.innerHTML = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; }
            .resume-content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Resume</h1>
          <div class="resume-content">${isEditing ? editableResume : resumeData}</div>
        </body>
        </html>
      `;

      const opt = {
        margin: 10,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
      };

      html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    setResumeData(editableResume);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditableResume(resumeData || "");
    setIsEditing(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableResume(e.target.value);
  };


  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "Aspivo");
    try {
      const { data } = await axios.post(`https://api.cloudinary.com/v1_1/do4wdvbcy/upload`, formData)
      setUploading(false)
      return data.secure_url
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
    }

  }
  const handleSetAsProfile = async () => {
    if (!resumeData) return;
    setUploading(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule as any;
      const element = document.createElement("div");
      element.innerHTML = `
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
            h1 { color: #333; }
            .resume-content { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <h1>Resume</h1>
          <div class="resume-content">${isEditing ? editableResume : resumeData}</div>
        </body>
        </html>
      `;
      const pdfBlob: Blob = await html2pdf().from(element).output('blob');
      const pdfFile = new File([pdfBlob], "resume.pdf", { type: "application/pdf" });
      const resumeUrl = await uploadToCloudinary(pdfFile);
      const response = await uploadResume(userId, resumeUrl)
      console.log("respo", response)
      setProfileData(response.response?.user)
      setUploading(false);
      onClose();
    } catch (error) {
      console.error("Error generating/uploading PDF:", error);
      setUploading(false);
    }
  };

  //  useEffect(() => {
  //       document.body.style.overflow = isOpen ? "hidden" : "auto";
  //       return () => {
  //           document.body.style.overflow = "auto";
  //       };
  //   }, [isOpen]);

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-11/12 max-w-4xl rounded-2xl bg-white p- shadow-xl space-y-6">
          <div className="flex justify-between px-6 pt-6">
            <div className="text-2xl font-medium">AI Resume Generator</div>
            <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
          </div>
          <div className="h-px  bg-gray-400 w-full" />
          {step === "info" && (
          <div className="space-y-6 p-6">
          <p className="text-gray-700 text-base leading-relaxed">
            We will generate your resume using your profile information.
            <span className="text-black font-semibold">  Please ensure your profile is complete before proceeding.</span>
          </p>
          <div className="flex justify-end">
            <button
              onClick={handleStart}
              className="bg-orange-600 hover:bg-orange-700 transition-colors text-white  rounded-lg font-bold px-6 py-3"
            >
              Start Generating
            </button>
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
            <div className="space-y-4 px-5 p-5">
              <div className=" flex justify-end space-x-7 px-5"> 
            
                <CiRedo onClick={handleRegenerate} className="w-6 h-6" />
                <GoPencil onClick={handleEdit}className="w-5 h-5" />
                <BsDownload onClick={handleDownload}className="w-5 h-5" />
          
             
              </div>
              {isEditing ? (
                <div className="h-96 rounded-lg border">
                  <textarea
                    className="w-full h-full p-4 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg"
                    value={editableResume}
                    onChange={handleEditChange}
                  />
                </div>
              ) : (
                <div className="h-96 overflow-y-auto rounded-lg border p-4 bg-gray-50">
                  <pre className="whitespace-pre-wrap text-gray-800">{resumeData}</pre>
                </div>
              )}

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <button className="bg-gray-600 text-white font-bold rounded-lg p-3" onClick={handleCancelEdit}>Cancel</button>
                    <button className="bg-orange-600 text-white  font-bold rounded-lg p-3" onClick={handleSaveEdit}>Save Changes</button>
                  </>
                ) : (
                  <>
                  
                    <button className="bg-orange-600 text-white  font-bold rounded-lg p-3" onClick={handleSetAsProfile}>Set as My Profile Resume</button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateResumeModal;