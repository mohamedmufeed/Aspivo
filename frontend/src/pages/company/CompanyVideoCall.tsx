import { AiOutlineTeam } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Peer from "peerjs";

const CompanyVideoCall: React.FC = () => {
  const location = useLocation();
  const { roomId, myPeerId, targetPeerId } = location.state || {};
  console.log("Room ID:", roomId);
  console.log("My Peer ID:", myPeerId);
  console.log("Target Peer ID:", targetPeerId);
  
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Initializing...");
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const callAttemptRef = useRef<number | null>(null);

  useEffect(() => {
    if (!myPeerId) {
      console.error("Missing company peer ID");
      setConnectionStatus("Error: Missing peer ID");
      return;
    }


    const peer = new Peer(myPeerId, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
      secure: false,
      debug: 3, 
    });
    
    peerRef.current = peer;

    peer.on("open", (id) => {
      console.log("Company peer connected with ID:", id);
      setConnectionStatus("Connected to signaling server. Accessing media...");
      

      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localStreamRef.current = stream;
          
    
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          setConnectionStatus("Waiting for user to join...");

          if (targetPeerId) {
            callAttemptRef.current = window.setInterval(() => {
              if (!isCallInProgress) {
                tryCallUser(peer, targetPeerId, stream);
              }
            }, 5000);
          }
        })
        .catch((err) => {
          console.error("Failed to get user media:", err);
          setConnectionStatus("Error: Failed to access camera and microphone");
        });
    });

    peer.on("call", (call) => {
      setConnectionStatus("Incoming call...");
      if (callAttemptRef.current !== null) {
        window.clearInterval(callAttemptRef.current);
      }
      setIsCallInProgress(true);
      
      if (localStreamRef.current) {
        call.answer(localStreamRef.current);
        setConnectionStatus("Call connected");
      } else {

        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            call.answer(stream);
            setConnectionStatus("Call connected");
          })
          .catch((err) => {
            console.error("Failed to get user media during call:", err);
            setConnectionStatus("Error: Failed to access media during call");
          });
      }
      
    
      call.on("stream", (remoteStream) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setConnectionStatus("Call in progress");
      });
      
      call.on("close", () => {
        setConnectionStatus("Call ended");
        setIsCallInProgress(false);
      });
      
      call.on("error", (err) => {
        console.error("Call error:", err);
        setConnectionStatus("Call error: " + err.message);
        setIsCallInProgress(false);
      });
    });

    peer.on("error", (err) => {
      console.error("Peer connection error:", err);
      setConnectionStatus("Connection error: " + err.message);
    });

   
    return () => {
      if (callAttemptRef.current !== null) {
        window.clearInterval(callAttemptRef.current);
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      peer.destroy();
    };
  }, [myPeerId, targetPeerId]);

  const tryCallUser = (peer: Peer, targetId: string, stream: MediaStream) => {
    console.log("Attempting to call user:", targetId);
    setConnectionStatus("Calling user...");
    
    try {
      const call = peer.call(targetId, stream);
      
      call.on("stream", (remoteStream) => {
       
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        setConnectionStatus("Call connected");
        setIsCallInProgress(true);
        
        if (callAttemptRef.current !== null) {
          window.clearInterval(callAttemptRef.current);
        }
      });
      
      call.on("close", () => {
        setConnectionStatus("Call ended");
        setIsCallInProgress(false);
      });
      
      call.on("error", (err) => {
        console.error("Call error:", err);
        setConnectionStatus("Call error: " + err.message);
      });
    } catch (err) {
      console.error("Error calling peer:", err);
      setConnectionStatus("Error initiating call");
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      //  message stting  is pending
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleLeaveCall = () => {
    if (callAttemptRef.current !== null) {
      window.clearInterval(callAttemptRef.current);
    }
    if (peerRef.current) {
      peerRef.current.destroy();
    }
    navigate("/company-messages");
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F6F6] px-10 pt-10 pb-10" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <div className="relative w-2/3 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <p className="text-lg font-semibold">Meeting Ongoing</p>
          <AiOutlineTeam className="bg-orange-200 p-2 rounded-full w-10 h-10" />
        </div>
        <div className="relative h-[70vh]">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-lg shadow-lg"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="absolute bottom-4 right-4 w-48 h-32 object-cover rounded-md border-2 border-white shadow-md"
            style={{ transform: "scaleX(-1)", objectFit: "cover" }}
          />
        </div>
        <div className="flex justify-center pt-6">
          <div className="bg-white flex justify-between items-center gap-10 px-10 py-4 shadow-lg w-[60%] max-w-xl rounded-2xl">
            <div className="flex flex-col items-center">
              <div onClick={toggleAudio} className={`${isMuted ? 'bg-red-600' : 'bg-orange-600'} text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition`}>
                <IoMicOutline className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">Mic</p>
            </div>
            <div className="flex flex-col items-center">
              <div onClick={toggleVideo} className={`${isVideoOff ? 'bg-red-600' : 'bg-orange-600'} text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition`}>
                <CiVideoOn className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">Cam</p>
            </div>
            <div className="flex flex-col items-center">
              <div onClick={handleLeaveCall} className="bg-white border border-orange-600 text-orange-600 p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition">
                <RxExit className="w-6 h-6" />
              </div>
              <p className="text-sm text-center pt-2">End</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/3 bg-white shadow-lg rounded-l-2xl p-4 flex flex-col">
        <h1 className="text-xl font-semibold p-3">Messages</h1>
        <hr className="text-gray-300" />
        <div className="flex-1 overflow-y-auto space-y-3 pt-4">
          {/* Future messages will go here */}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 bg-white shadow-xl border border-gray-100 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <div onClick={handleSendMessage} className="bg-orange-600 rounded-lg p-5 cursor-pointer">
            <LuSend className="text-white w-5 h-5" />
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-500">Connection Status: {connectionStatus}</p>
      </div>
    </div>
  );
};

export default CompanyVideoCall;