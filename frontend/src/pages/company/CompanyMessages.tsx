import { useState, useEffect, useRef } from "react";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import { IoIosSearch } from "react-icons/io";
import person from "../../assets/person_1.jpg";
import { IoVideocamOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { getConversations, getMessageHistory, sendMessage } from "../../services/messageService";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { format } from 'date-fns';
import { useSocket } from "../../hooks/socket";
import axios from "axios";
import { fetchCompany } from "../../services/company/compayJob";
import { TimePickerModal } from "../../components/Company/Modals/TimePickerModal";


export interface ChatMessage {
    _id: string;
    senderId: string;
    imageUrl?: string
    message: string;
    timestamp: string;
}

interface RawSocketMessage {
    _id?: string;
    senderId: string;
    imageUrl?: string;
    message: string;
    timeStamp: string;
}
export interface Conversation {

    targetId: string;
    targetName: string;
    lastMessage: string;
    targetProfile: string
    timestamp: string;
    unread?: boolean;
    channel: string;
}

const CompanyMessages = () => {
    const [selected, setSelected] = useState<string | undefined>("Messages");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [companyId, setCompanyId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const socket = useSocket();
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [imageError, setImageError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id || "";
    const [showTimeModal, setShowTimeModal] = useState(false)

    useEffect(() => {
        const fetchCompanie = async () => {
            try {
                const response = await fetchCompany(userId);
                setCompanyId(response.company.company._id);
            } catch (error) {
                console.error("Error fetching company:", error);
            }
        };
        fetchCompanie();
    }, [userId]);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!companyId) {
                console.log(companyId, "companyId is not set");
                return;
            }

            try {
                const data = await getConversations(companyId, "company");
                if (!Array.isArray(data)) {
                    console.warn("Expected array from getConversations, got:", data);
                    return;
                }

                let uniqueConversations = data.reduce((unique: Conversation[], current: any) => {
                    if (!unique.some((conv) => conv.targetId === current.targetId)) {
                        unique.push({
                            targetId: current.targetId,
                            targetName: current.targetName,
                            targetProfile: current.targetProfile,
                            lastMessage: current.lastMessage || "",
                            timestamp: current.timestamp,
                            unread: current.unread || false,
                            channel: current.channel,
                        });
                    }
                    return unique;
                }, []);

                const newConversation = location.state?.newConversation as Conversation | undefined;
                if (newConversation) {
                    const index = uniqueConversations.findIndex((conv) => conv.targetId === newConversation.targetId);

                    if (index === -1) {
                        uniqueConversations.push(newConversation);
                    } else {
                        uniqueConversations[index] = { ...uniqueConversations[index], ...newConversation };
                    }
                }

                setConversations(uniqueConversations);

                const firstUserId = uniqueConversations.length > 0
                    ? uniqueConversations[0].targetId
                    : newConversation?.targetId;

                if (firstUserId) {
                    setSelectedUserId(firstUserId);
                } else {
                    console.log("No firstUserId found");
                }
                window.history.replaceState({}, document.title);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [companyId, location.state?.newConversation]);


    useEffect(() => {
        if (!socket || !selectedUserId || conversations.length === 0) return;

        if (!socket.connected) {
            socket.connect();
            console.log('Socket connecting...');
        }

        socket.emit("registerUser", "company", companyId);

        const conversation = conversations.find((c) => c.targetId === selectedUserId);
        const channel = conversation?.channel;

        if (!channel) {
            console.log("No channel found for selectedUserId:", selectedUserId);
            return;
        }

        const fetchHistory = async () => {
            try {
                const data = await getMessageHistory(channel);
                if (data) setMessages(data);
            } catch (error) {
                console.error("Error fetching message history:", error);
            }
        };

        fetchHistory();
        socket.emit("joinChannel", channel);
        const handleReceiveMessage = (message: RawSocketMessage) => {
            console.log("Received message:", message);
            const normalizedMessage: ChatMessage = {
                _id: message._id || `${message.senderId}-${message.timeStamp}`,
                senderId: message.senderId,
                message: message.message || "",
                imageUrl: message.imageUrl,
                timestamp: message.timeStamp || new Date().toISOString(),
            };

            if (normalizedMessage.message || normalizedMessage.imageUrl) {
                setMessages((prev) => [...prev, normalizedMessage]);
            } else {
                console.warn("Invalid message received after normalization:", normalizedMessage);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);
        return () => {
            if (channel) {
                console.log(`Leaving channel: ${channel}`);
                socket.emit("leaveChannel", channel);
                socket.off("receiveMessage", handleReceiveMessage);
            }
        };
    }, [selectedUserId, conversations, companyId, socket]);
    useEffect(() => {
        return () => {
            if (socket) {
                const currentChannel = conversations.find((c) => c.targetId === selectedUserId)?.channel;
                if (currentChannel) {
                    socket.emit("leaveChannel", currentChannel);
                }
            }
        };
    }, [socket, conversations, selectedUserId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (!socket) return;
        if ((newMessage.trim() || imageUrl) && selectedUserId && companyId) {
            const channel = conversations.find((c) => c.targetId === selectedUserId)?.channel;
            if (channel) {
                try {
                    const messageData = {
                        channel,
                        message: newMessage || (imageUrl ? imageUrl : ""),
                        imageUrl: imageUrl || undefined,
                        senderId: companyId,
                        timeStamp: new Date().toISOString(),
                    };
                    await sendMessage(channel, messageData.message, companyId, messageData.imageUrl);
                    socket.emit("sendMessage", messageData);
                    setNewMessage("");
                    setImageUrl(null);
                    const data = await getMessageHistory(channel);
                    if (data) setMessages(data);
                } catch (error) {
                    console.error("Error sending message:", error);
                }
            }
        }
    };

    const handleSelectConversation = (targetId: string) => {
        setSelectedUserId(targetId);
        setMessages([]);
        console.log("Selected conversation:", targetId);
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const uploadedImageUrl = await uploadToCloudinary(file);
            if (uploadedImageUrl) {
                setImageUrl(uploadedImageUrl);
                setImageError(null);
            }
        }
    };
    const uploadToCloudinary = async (file: File) => {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Aspivo");

        try {
            const { data } = await axios.post(`https://api.cloudinary.com/v1_1/do4wdvbcy/image/upload`, formData);
            console.log("Image uploaded successfully:", data.secure_url);

            return data.secure_url;

        } catch (error) {
            console.error("Error uploading image:", error);
            setImageError("Failed to upload image. Please try again.");
            console.log(imageError)
            return null;
        } finally {
            setLoading(false)
        }
    };

    const handleFileChange = () => {
        fileInputRef.current?.click();
    };


    const TimesheduleMeeting = () => {
        setShowTimeModal(true);
    };

    return (
        <div className="flex min-h-screen ">
            <CompanySidebar setSelected={setSelected} />
            <div className="bg-[#F6F6F6] w-full flex flex-col" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <ComapanyHeader heading="Messages" />
                <div className="flex flex-1">
                    {/* Contact Section */}
                    <div className="bg-white w-full sm:w-1/3 p-4 border-r border-gray-200">
                        <div className="bg-white shadow-md rounded-lg p-2 mb-4 flex items-center">
                            <input
                                type="text"
                                placeholder="Search Messages..."
                                className="w-full px-3 py-2 rounded-md focus:outline-none text-sm sm:text-base"
                            />
                            <IoIosSearch className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 ml-2" />
                        </div>
                        {conversations.length > 0 ? (

                            conversations.map((conv) => (
                                <div
                                    key={conv.targetId}
                                    className={`flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200  ${selectedUserId === conv.targetId ? "bg-gray-100" : ""
                                        }`}
                                    onClick={() => handleSelectConversation(conv.targetId)}
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={conv.targetProfile}
                                            alt={conv.targetName}
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3"
                                        />
                                        <div>
                                            <h1 className="font-semibold text-sm sm:text-base">{conv.targetName}</h1>
                                            {conv.lastMessage && conv.lastMessage.startsWith("http") ? (
                                                <p className="text-sm text-gray-700">
                                                    Image
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-700">
                                                    {conv.lastMessage && conv.lastMessage.length > 20
                                                        ? `${conv.lastMessage.slice(0, 20)}...`
                                                        : conv.lastMessage || "No message"}
                                                </p>
                                            )}

                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs sm:text-sm text-gray-400">
                                            {format(new Date(conv.timestamp), 'p')}
                                        </span>
                                        {/* {conv.unread && <div className="bg-orange-600 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-1" />} */}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm">No conversations available</p>
                        )}
                    </div>
                    <div className="w-px bg-gray-400 hidden sm:block" />
                    {/* Message Section */}
                    <div className="bg-white w-full sm:w-2/3 p-4 flex flex-col">
                        {selectedUserId && (
                            <>
                                <div className="flex justify-between items-center px-4 py-2">
                                    <div className="flex items-center">
                                        <img
                                            src={conversations.find((c) => c.targetId === selectedUserId)?.targetProfile || person}
                                            alt="User"
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3"
                                        />
                                        <div className="space-y-1">
                                            <h1 className="font-bold text-sm sm:text-lg">
                                                {conversations.find((c) => c.targetId === selectedUserId)?.targetName || "Unknown"}
                                            </h1>
                                        </div>
                                    </div>
                                    <div onClick={TimesheduleMeeting} className="cursor-pointer">
                                        <IoVideocamOutline className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                    </div>
                                    {showTimeModal && (
                                        <TimePickerModal
                                            setShowTimeModal={setShowTimeModal}
                                            companyId={companyId}
                                            selectedUserId={selectedUserId}
                                            conversations={conversations}
                                        />
                                    )}

                                </div>
                                <div className="h-px bg-gray-400 w-full mt-2" />
                                {/* Scrollable Message Area */}
                                <div className="flex-1 overflow-y-auto p-2 sm:p-4" style={{ maxHeight: "calc(100vh - 300px)" }}>
                                    {messages.length > 0 ? (
                                        messages.map((msg) => (
                                            <div
                                                key={`${msg?._id || msg.timestamp}-${msg.senderId}`}
                                                className={`flex mb-2 ${msg.senderId === companyId ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`p-2 rounded-lg max-w-xs sm:max-w-md ${msg.senderId === companyId ? "bg-orange-200 text-black" : "bg-white text-black shadow-xl shadow-gray-200"}`}
                                                >

                                                    {msg.imageUrl && (
                                                        <img src={msg.imageUrl} alt="Uploaded" className="max-w-[200px]  h-auto mb-2 rounded" />
                                                    )}

                                                    {msg.message && msg.message.startsWith("http") ? (
                                                        <img src={msg.message} alt="Preview" className="max-w-[200px]  h-auto mb-2 rounded" />
                                                    ) :

                                                        msg.message && msg.message.includes("scheduled video call") ? (
                                                            <>
                                                                <p className="text-sm sm:text-base">
                                                                    You have a scheduled video call!<br />
                                                                    <span className="font-medium">
                                                                        Time: {msg.message.split("Time:")[1]?.split("🔗")[0]?.trim()}
                                                                    </span>
                                                                </p>
                                                                <a
                                                                    href={msg.message.match(/(http[s]?:\/\/[^\s]+)/)?.[0] || "#"}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-500 underline break-all block mt-1 text-sm"
                                                                >
                                                                    🔗 Join: {msg.message.match(/(http[s]?:\/\/[^\s]+)/)?.[0]}
                                                                </a>
                                                            </>
                                                        ) :


                                                            (
                                                                <p className="text-sm sm:text-base">{msg.message}</p>
                                                            )}

                                                    {/* Dispaly when meeting link */}




                                                    <span className={`text-xs sm:text-sm block mt-1 ${msg.senderId === companyId ? "text-gray-500" : "text-gray-900 "}`}>
                                                        {format(new Date(msg.timestamp || Date.now()), "p")}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 text-sm">No messages yet or error fetching history</p>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="h-px bg-gray-400 w-full" />
                                {/* Fixed Input Section */}
                                <div className="flex items-center justify-between px-4 py-2 mt-2">
                                    <div>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} />
                                        <IoIosLink onClick={handleFileChange} className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                    </div>

                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Enter the message..."
                                        className="w-2/3 sm:w-3/4 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none text-sm sm:text-base"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-orange-600 text-white p-2 rounded-lg flex items-center justify-center disabled:bg-gray-400"
                                        disabled={(loading || (!newMessage.trim() && !imageUrl))}
                                    >
                                        {loading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 sm:h-6 sm:w-6 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                ></path>
                                            </svg>
                                        ) : (
                                            <LuSend className="w-5 h-5 sm:w-6 sm:h-6" />
                                        )}
                                    </button>

                                </div>
                            </>
                        )}
                        {!selectedUserId && (
                            <div className="text-center text-gray-500 h-full flex items-center justify-center text-sm sm:text-base">
                                Select or start a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyMessages;