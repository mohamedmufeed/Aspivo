import { AiOutlineTeam } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Peer, { MediaConnection } from "peerjs";

const VideoCall = () => {
  const { state } = useLocation();
  const roomId = state?.room;
  const peerid=state?.peerid;
  console.log("the roomi id ", roomId)
  console.log(peerid,"the perrr id")
  const [peerId, setPeerId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peer = useRef<Peer | null>(null);
  const peerConnection = useRef<MediaConnection | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [mediaStatus, setMediaStatus] = useState<string>("Waiting for media access...");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const p = new Peer(peerid, {
      host: "localhost",
      port: 9000,
      path: "/peerjs",
      secure: false,
      debug: 3,
      config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
    });

    peer.current = p;

    p.on("open", (id) => {
      console.log("Peer connected with ID:", id);
      setPeerId(id);
      initLocalStream().then((stream) => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play();
        }

        const call = p.call(roomId, stream); // Connect to the initiator
        call.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });

        peerConnection.current = call;
      });
    });

    p.on("call", (incomingCall) => {
      console.log("Incoming call from:", incomingCall.peer);
      initLocalStream().then((stream) => {
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          }
        });
        peerConnection.current = incomingCall;
      });
    });

    return () => {
      if (peer.current) peer.current.destroy();
      if (localStream) localStream.getTracks().forEach((track) => track.stop());
      if (peerConnection.current) peerConnection.current.close();
    };
  }, []);

  const initLocalStream = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStatus("Media access granted");
      setLocalStream(stream);
      return stream;
    } catch (err: any) {
      console.error("Media access error:", err);
      setMediaStatus(`Media access denied: ${err.name} - ${err.message}`);
      throw err;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        message: newMessage,
        senderId: peerId,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, message]);
      console.log("Message sent:", message);
      setNewMessage("");
    }
  };

  const handleLeaveCall = () => {
    if (peerConnection.current) peerConnection.current.close();
    if (peer.current) peer.current.destroy();
    navigate("/messages");
  };

  const toggleAudio = () => {
    if (localStream) {
      const track = localStream.getAudioTracks()[0];
      track.enabled = !track.enabled;
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
              <div
                onClick={toggleAudio}
                className="bg-orange-600 text-white p-3 rounded-xl cursor-pointer hover:bg-orange-700 transition"
              >
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
              <div
                onClick={handleLeaveCall}
                className="bg-white border border-orange-600 text-orange-600 p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition"
              >
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
          {messages.map((msg, index) => (
            <div
              key={`${msg.timestamp}-${index}`}
              className={`p-3 rounded-lg text-sm ${msg.senderId === peerId ? "bg-orange-200 self-end ml-auto" : "bg-gray-100"}`}
            >
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
          <div
            onClick={handleSendMessage}
            className="bg-orange-600 rounded-lg p-5 cursor-pointer"
          >
            <LuSend className="text-white w-5 h-5" />
          </div>
        </div>
        <p className="text-sm mt-2 text-gray-500">Media Status: {mediaStatus}</p>
      </div>
    </div>
  );
};

export default VideoCall;
