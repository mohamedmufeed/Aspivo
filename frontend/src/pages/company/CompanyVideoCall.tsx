import { AiOutlineTeam } from "react-icons/ai";
import { LuSend } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { CiVideoOn } from "react-icons/ci";
import { RxExit } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket";
import peerjs, { Peer } from "peerjs"

const VideoCall = () => {
    const { state } = useLocation();
    const roomId = state?.roomId;
    const selectedUserId = state?.selectedUserId;
    const [messages, setMessages] = useState<any[]>([]);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const peer=useRef<Peer|null>(null)
    const peerConnection = useRef<any>(null);
    const [newMessage, setNewMessage] = useState("");
    const navigate = useNavigate();
    const socket = useSocket();
    const [isInitiator, setIsInitiator] = useState(false);

    useEffect(() => {
        if (!roomId || !socket) return;

        if (socket.connected) socket.disconnect();
        socket.connect();
        socket.emit("joinMeeting", roomId, (response: any) => {
            console.log("Join meeting response:", response);
            if (response.success) {
                initializeWebRTC();
                if (!response.isExisting) {
                    setIsInitiator(true);
                    createAndSendOffer(); 
                } else {
                    console.log("Existing participants detected, waiting for offer...");
                }
            } else {
                console.error("Failed to join meeting:", response.error);
            }
        });

        // Handle cleanup
        return () => {
            socket.emit("leaveMeeting", roomId);
            if (peerConnection.current) {
                peerConnection.current.close();
                peerConnection.current = null;
            }
            socket.disconnect();
        };
    }, [roomId, socket]);

    const initializeWebRTC = () => {
        if (!socket || peerConnection.current) return;

        peerConnection.current = new RTCPeerConnection({
            iceServers: [
                { urls: "stun:stun.l.google.com:19302" },
                // Add TURN server if needed (e.g., { urls: "turn:your-turn-server:3478", username: "user", credential: "pass" })
            ],
        });

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                if (localVideoRef.current) localVideoRef.current.srcObject = stream;
                stream.getTracks().forEach((track) => peerConnection.current?.addTrack(track, stream));
            })
            .catch((error) => console.error("Media error:", error));

        peerConnection.current.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
                remoteVideoRef.current.srcObject = event.streams[0];
                console.log("Remote stream received");
            }
        };

        peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && socket.connected) {
                socket.emit("iceCandidate", { roomId, candidate: event.candidate });
                console.log("ICE candidate sent:", event.candidate);
            }
        };
    };

    const createAndSendOffer = () => {
        if(!socket) return
        if (peerConnection.current) {
            peerConnection.current.createOffer().then((offer) => {
                peerConnection.current?.setLocalDescription(offer);
                socket.emit("offer", { roomId, offer });
                console.log("Offer sent:", offer);
            }).catch((error) => console.error("Offer error:", error));
        }
    };

    // Handle offer (for participant)
    useEffect(() => {
        if (!socket) return;

        const handleOffer = async ({ offer, sender }: { offer: RTCSessionDescriptionInit; sender: string }) => {
            console.log("Offer received from:", sender);
            if (!isInitiator && peerConnection.current && !peerConnection.current.remoteDescription) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await peerConnection.current.createAnswer();
                await peerConnection.current.setLocalDescription(answer);
                socket.emit("answer", { roomId, answer });
                console.log("Answer sent:", answer);
            }
        };

        socket.on("offer", handleOffer);

        return () => {
            socket.off("offer", handleOffer);
        };
    }, [isInitiator, socket, roomId]);

    // Handle answer (for initiator)
    useEffect(() => {
        if (!socket) return;

        const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
            console.log("Answer received:", answer);
            if (isInitiator && peerConnection.current && !peerConnection.current.remoteDescription) {
                await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
            }
        };

        socket.on("answer", handleAnswer);

        return () => {
            socket.off("answer", handleAnswer);
        };
    }, [isInitiator, socket, roomId]);

    // Handle ICE candidates
    useEffect(() => {
        if (!socket) return;

        const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
            console.log("ICE candidate received:", candidate);
            if (peerConnection.current) {
                await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate)).catch((error) => console.error("ICE candidate error:", error));
            }
        };

        socket.on("iceCandidate", handleIceCandidate);

        return () => {
            socket.off("iceCandidate", handleIceCandidate);
        };
    }, [socket, roomId]);

    // Handle receiving messages
    useEffect(() => {
        if (!socket) return;

        socket.on("receiveMessage", (message: any) => {
            setMessages((prev) => [...prev, message]);
            console.log("Message received:", message);
        });

        return () => {
            socket.off("receiveMessage");
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (!socket || !roomId) return;
        if (newMessage.trim()) {
            const channel = `chat:${roomId}`;
            const message = { channel, message: newMessage, senderId: roomId, timestamp: new Date().toISOString() };
            socket.emit("sendMessage", message);
            setMessages((prev) => [...prev, message]);
            setNewMessage("");
        }
    };

    const handleLeaveCall = () => {
        navigate("/messages");
    };

    return (
        <div className="flex h-screen bg-[#F6F6F6] px-10 pt-10 pb-10" style={{ fontFamily: "DM Sans, sans-serif" }}>
            {/* Left Video Section */}
            <div className="relative w-2/3 p-4">
                <div className="flex items-center space-x-2 mb-4">
                    <p className="text-lg font-semibold">Meeting Ongoing</p>
                    <AiOutlineTeam className="bg-orange-200 p-2 rounded-full w-10 h-10" />
                </div>

                <div className="relative h-[70vh]">
                    <video ref={localVideoRef} autoPlay muted className="w-full h-full object-cover rounded-lg shadow-lg" style={{ transform: "scaleX(-1)", objectFit: "cover" }} />
                    <video ref={remoteVideoRef} autoPlay className="absolute bottom-4 right-4 w-48 h-32 object-cover rounded-md border-2 border-white shadow-md" style={{ transform: "scaleX(-1)", objectFit: "cover" }} />
                </div>
                {/* Menu bar */}
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
                            <div onClick={handleLeaveCall} className="bg-white border border-orange-600 text-orange-600 p-3 rounded-xl cursor-pointer hover:bg-orange-50 transition">
                                <RxExit className="w-6 h-6" />
                            </div>
                            <p className="text-sm text-center pt-2">End</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Message Section */}
            <div className="w-1/3 bg-white shadow-lg rounded-l-2xl p-4 flex flex-col">
                <h1 className="text-xl font-semibold p-3">Messages</h1>
                <hr className="text-gray-300" />
                <div className="flex-1 overflow-y-auto space-y-3 pt-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`p-3 rounded-lg text-sm ${msg.senderId === roomId ? "bg-orange-200 self-end ml-auto" : "bg-gray-100"}`}
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
                    <div onClick={handleSendMessage} className="bg-orange-600 rounded-lg p-5 cursor-pointer">
                        <LuSend className="text-white w-5 h-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCall;