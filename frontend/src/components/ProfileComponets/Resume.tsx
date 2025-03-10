import React from 'react'
import { AiOutlineDelete } from 'react-icons/ai'
import { BsDownload } from 'react-icons/bs'
import { CiStickyNote } from 'react-icons/ci'
import { IoCloudUploadOutline } from 'react-icons/io5'

const Resume = () => {
  return (
   <div className="bg-white shadow-gray-100 shadow-lg w-full rounded-lg p-5 mt-5">
                        <div className="flex justify-between px-8">
                            <h1 className="font-medium text-2xl">Resume</h1>
                        </div>

                        <div className="flex mx-auto w-3/4 bg-white h-[60px] items-center shadow-gray-200 shadow-lg rounded-md justify-between px-6 mt-4">
                            <div className="flex items-center space-x-4">
                                <CiStickyNote className="w-6 h-6 text-gray-600" />
                                <p className="text-gray-700">Johndaniel_resume.pdf</p>
                            </div>
                            <div className="flex space-x-6">
                                <BsDownload className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
                                <AiOutlineDelete className="w-6 h-6  text-gray-600 cursor-pointer hover:text-gray-800" />
                            </div>
                        </div>

                        <div className="w-5/6 mx-auto mt-5 p-6 flex flex-col items-center justify-center rounded-lg outline-1.5 px-6 outline-dashed">
                            <IoCloudUploadOutline className="w-8 h-8 text-gray-900 mb-2" />
                            <h2 className="font-bold text-md text-gray-700 text-center">
                                Drag and Drop file here or{" "}
                                <span className="text-orange-600 cursor-pointer">
                                    Choose File
                                </span>
                            </h2>
                            <p className="mt-2 text-sm text-gray-500">
                                Supported Formats: PDF, JPEG
                            </p>
                        </div>

                        <div className="flex justify-center mt-6">
                            <button className="font-semibold px-6 py-3 rounded-lg text-white bg-orange-600 hover:bg-orange-700 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </div>
  )
}

export default Resume