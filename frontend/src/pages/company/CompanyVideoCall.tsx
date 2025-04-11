import { AiOutlineTeam } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Peer from "peerjs";

const CompanyVideoCall = () => {
  const { state } = useLocation();
  const roomId = state?.roomId || `meeting-${Date.now()}`;
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [mediaStatus, setMediaStatus] = useState("Waiting for media access...");
  const [peerId, setPeerId] = useState("");
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peer = useRef<Peer | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const currentCall = useRef<any>(null);

  useEffect(() => {
    const setupCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        setMediaStatus("Media access granted");
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }

        peer.current = new Peer(peerId, {
          host: "localhost",
          port: 9000,
          path: "/peerjs",
          config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
        });

        peer.current.on("open", (id) => {
          setPeerId(id);
          console.log("Company: Peer ID ->", id);
        });

        peer.current.on("call", (call) => {
          console.log("Incoming call from:", call.peer);
          call.answer(stream);
          currentCall.current = call;

          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              remoteVideoRef.current.play();
            }
          });
        });
      } catch (err: any) {
        console.error("Media error:", err.message);
        setMediaStatus(`Media access denied: ${err.message}`);
      }
    };

    setupCall();

    return () => {
      if (peer.current) peer.current.destroy();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
      if (currentCall.current) currentCall.current.close();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        message: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleLeaveCall = () => {
    if (currentCall.current) currentCall.current.close();
    if (peer.current) peer.current.destroy();
    navigate("/messages");
  };

  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
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
          <video ref={remoteVideoRef} autoPlay className="w-full h-full object-cover rounded-lg shadow-lg" style={{ transform: "scaleX(-1)" }} />
          <video ref={localVideoRef} autoPlay muted className="absolute bottom-4 right-4 w-48 h-32 rounded-md border-2 border-white shadow-md" style={{ transform: "scaleX(-1)" }} />
        </div>
        <div className="flex justify-center pt-6">
          <div className="bg-white flex justify-between items-center gap-10 px-10 py-4 shadow-lg w-[60%] max-w-xl rounded-2xl">
            <div className="flex flex-col items-center">
              <div onClick={toggleAudio} className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition">
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
          {messages.map((msg, index) => (
            <div key={index} className="p-3 rounded-lg text-sm bg-orange-200 self-end ml-auto">
              {msg.message}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 bg-white shadow-xl border border-gray-100 pl-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div onClick={handleSendMessage} className="bg-orange-600 rounded-lg p-5 cursor-pointer">
            <LuSend className="text-white w-5 h-5" />
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-500">Media Status: {mediaStatus}</p>
      </div>
    </div>
  );
};

export default CompanyVideoCall;
