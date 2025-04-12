import { AiOutlineTeam } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Peer from "peerjs";

const VideoCall = () => {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const roomId = params.get("room")
  const peerId = params.get("peerId")

console.log(" the peer id from  ",peerId)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const peer = new Peer(peerId!, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
      secure: false,
    });
    peer.on("open", (id) => {
      console.log("Peer connected with ID From the user side:", id);
 
    });
    peer.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        call.answer(stream)
        console.log("the lcal current",localVideoRef.current)
        if (localVideoRef.current) {
          console.log("the stram of the local",stream)
          localVideoRef.current.srcObject = stream
          localVideoRef.current.play()
        }

        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            console.log("the stream of the remote",remoteStream)
            remoteVideoRef.current.srcObject = remoteStream
            remoteVideoRef.current.play()
          }
        })
      })
    })
    return () => peer.destroy()
  }, [])

  return (
    <div
      className="flex h-screen bg-[#F6F6F6] px-10 pt-10 pb-10"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <div className="relative w-2/3 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <p className="text-lg font-semibold">Meeting Ongoing</p>
          <AiOutlineTeam className="bg-orange-200 p-2 rounded-full w-10 h-10" />
        </div>

        <div className="relative h-[70vh]">
          <video
            ref={remoteVideoRef}
            autoPlay
            className="w-full h-full object-cover rounded-lg shadow-lg"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="absolute bottom-4 right-4 w-48 h-32 object-cover rounded-md border-2 border-white shadow-md"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          />
        </div>

        <div className="flex justify-center pt-6">
          <div className="bg-white flex justify-between items-center gap-10 px-10 py-4 shadow-lg w-[60%] max-w-xl rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition">
                <IoMicOutline className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">Mic</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition">
                <CiVideoOn className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">Cam</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white border border-orange-600 text-orange-600 p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition">
                <RxExit className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">Leave</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/3 bg-white shadow-lg rounded-l-2xl p-4 flex flex-col">
        <h1 className="text-xl font-semibold p-3">Messages</h1>
        <hr className="text-gray-300" />
        <div className="flex-1 overflow-y-auto space-y-3 pt-4">
          {/* Messages will go here */}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full p-2 bg-white shadow-xl border border-gray-100 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="bg-orange-600 rounded-lg p-5 cursor-pointer">
            <LuSend className="text-white w-5 h-5" />
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-500">Media Status: Waiting for media access...</p>
      </div>
    </div>
  );
};

export default VideoCall;
