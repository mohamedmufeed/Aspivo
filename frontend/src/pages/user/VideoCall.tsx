
import { AiOutlineTeam } from "react-icons/ai";
import videoImage from "../../assets/Download premium image of Woman saying hello, distance relationship through video call by McKinsey  about person, living room, video call, portrait, and adult 4332607.jpeg";
import secondVideoImage from "../../assets/Free Photo _ African american vlogger pressing wireless headphones to ear with hand listening to fan talking while holding white cup_ influencer sitting at desk with laptop interacting with audience.jpeg";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";

import { CiVideoOn } from "react-icons/ci";

import { RxExit } from "react-icons/rx";
import { useEffect, useRef } from "react";



const VideoCall = () => {
   
    return (
        <div className="flex h-screen bg-[#F6F6F6] px-10 pt-10 pb-10 " style={{ fontFamily: "DM Sans, sans-serif" }} >
            {/* Left Video Section */}
            <div className="relative w-2/3 p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <p className="text-lg font-semibold">Meeting Ongoing</p>
                    <AiOutlineTeam className="bg-orange-200 p-2 rounded-full w-10 h-10" />
                </div>

                <div className="relative h-[70vh]">
                <video  autoPlay muted     className="w-full h-full object-cover rounded-lg shadow-lg"/>
                <video  autoPlay   className="absolute bottom-4 right-4 w-48 h-32 object-cover rounded-md border-2 border-white shadow-md" />
            
                </div>
                {/* menu bar */}
        
        <div className="flex justify-center pt-6">
            <div className="bg-white flex justify-between items-center gap-10 px-10 py-4 shadow-lg w-[60%] max-w-xl rounded-2xl">
                {/* Mic Button */}
                <div className="flex flex-col items-center">
                    <div className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition">
                        <IoMicOutline className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-center pt-2">Mic</p>
                </div>

                {/* Camera Button */}
                <div className="flex flex-col items-center">
                    <div className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition">
                        <CiVideoOn className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-center pt-2">Cam</p>
                </div>

                {/* Leave Button */}
                <div className="flex flex-col items-center">
                    <div className="bg-white border border-orange-600 text-orange-600 p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition">
                        <RxExit className="w-6 h-6" />
                    </div>
                    <p className="text-sm text-center pt-2">Leave</p>
                </div>
            </div>
        </div>

            </div>

            {/* Right Message Section */}
            <div className="w-1/3 bg-white shadow-lg  rounded-l-2xl p-4 flex flex-col">
                <h1 className="text-xl font-semibold  p-3">Messages</h1>
                <hr className=" text-gray-300" />
                <div className="flex-1 overflow-y-auto space-y-3 pt-4">
                    {/* Sample messages */}
                    <div className="bg-gray-100 p-3 rounded-lg text-sm">
                        Hello! Can you hear me?
                    </div>
                    <div className="bg-orange-100 p-3 rounded-lg text-sm self-end ml-auto">
                        Yes! Loud and clear.
                    </div>
                </div>
                <div className="mt-4 flex gap-3">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        className="w-full p-2  bg-white shadow-xl border border-gray-100 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <div className=" bg-orange-600 rounded-lg p-5  cursor-pointer">
                        <LuSend className=" text-white w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;
