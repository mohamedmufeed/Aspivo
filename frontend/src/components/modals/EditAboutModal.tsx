import { VscClose } from "react-icons/vsc";
interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
}
const EditAboutModal :React.FC<EditProfileModalProps> = ({ isOpen, onClose, userId }) => {
  return (
   <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
                className="absolute inset-0 bg-black opacity-30 transition-opacity duration-300"
                onClick={onClose}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <div className="bg-white w-5/6 mx-auto rounded-lg shadow-lg">
                    <div className="flex justify-between mt-2 px-5 p-5">
                        <h1 className="text-2xl font-medium">Edit Profile</h1>
                        <VscClose onClick={onClose} className="cursor-pointer w-8 h-8" />
                    </div>
                    <hr className="mt-2" />
                    <form  encType="multipart/form-data">
                        

                        <h2 className="font-medium text-lg pl-5 mt-6">Personal Information</h2>
                        <div className="space-y-5 mt-8 px-7 flex flex-col">
                           
                           
                            <div className="flex flex-col">
                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location"  className="border p-2 w-full rounded-lg" />
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

export default EditAboutModal