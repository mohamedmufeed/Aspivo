import { useEffect, useState, useRef } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import Navbar from "../../components/homecomponts/Navbar";
import { GoPencil } from "react-icons/go";
import { useNavigate, useLocation } from "react-router-dom";
import { getConversations, getMessageHistory, sendMessage, InitializeChat } from "../../services/messageService";
import { io } from "socket.io-client";
import { IoVideocamOutline } from "react-icons/io5";
import { IoIosLink, IoIosSearch } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { fetchCompany } from "../../services/company/compayJob";
import { format } from 'date-fns';
import avathar from "../../assets/user.png"
import { useSocket } from "../../hooks/socket";

interface ChatMessage {
    senderId: string;
    message: string;
    timestamp: string;
}

interface Conversation {
    employeeId: string;
    employeeName: string;
    lastMessage: string;
    timestamp: string;
    employeeProfile: string,
    unread?: boolean;
    channel?: string;
}

const Messages = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [companyId, setCompanyId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
     const socket = useSocket();

    const user = useSelector((state: RootState) => state.auth.user);
    const authUserId = user?._id || "";

    useEffect(() => {
        if (authUserId) {
            setUserId(authUserId);
            const fetchUserData = async () => {
                try {
                    const response = await fetchCompany(authUserId);
                    setCompanyId(response.company.company._id || authUserId);
                } catch (error) {
                    console.log("Error fetching company ID:", error);
                    setCompanyId(authUserId);
                }
                setLoading(false);
            };
            fetchUserData();
        }
    }, [authUserId]);

    useEffect(() => {
        if (!userId || loading) return;

        const fetchData = async () => {
            try {
                const data = await getConversations(userId, "employee");
                const formatted = data.map((conv: any) => ({
                    employeeProfile: conv.targetProfile || "",
                    employeeId: conv.targetId || conv.companyId,
                    employeeName: conv.targetName || conv.companyName,
                    lastMessage: conv.lastMessage || "",
                    timestamp: conv.timestamp,
                    unread: conv.unread || false,
                    channel: conv.channel || `chat:${conv.targetId || conv.companyId}:${userId}`,
                }));
                setConversations(formatted);
            } catch (error) {
                console.error("Error fetching employee conversations:", error);
            }
        };
        fetchData();
    }, [userId, loading]);


    useEffect(() => {
        if (!socket) return;
        if (selectedEmployeeId && userId && conversations.length > 0) {
            const conversation = conversations.find((c) => c.employeeId === selectedEmployeeId);
            const channel = conversation?.channel || `chat:${selectedEmployeeId}:${userId}`;
            const fetchHistory = async () => {
                try {
                    const data = await getMessageHistory(channel);
                    console.log("Fetched messages:", data);
                    if (data) setMessages(data);
                } catch (error) {
                    console.error("Error fetching message history:", error);
                }
            };

            fetchHistory();

            socket.emit("joinChannel", channel);
            socket.on("receiveMessage", (message: ChatMessage) => {
                setMessages((prev) => [...prev, message]);
            });

            return () => {
                socket.off("receiveMessage");
                socket.emit("leaveChannel", channel);
            };
        }
    }, [selectedEmployeeId, userId, conversations]);

    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Send message
    const handleSendMessage = async () => {
        if (!socket) return;
        if (newMessage.trim() && selectedEmployeeId && userId && companyId) {
            const conversation = conversations.find((c) => c.employeeId === selectedEmployeeId);
            const channel = conversation?.channel || `chat:${selectedEmployeeId}:${userId}`;
            try {
                await sendMessage(channel, newMessage, userId);
                socket.emit("sendMessage", { channel, message: newMessage, senderId: userId });
                setNewMessage("");
                const updatedMessages = await getMessageHistory(channel);
                setMessages(updatedMessages);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    const handleSelectConversation = (employeeId: string) => {
        setSelectedEmployeeId(employeeId);
        setMessages([]); // Clear messages when switching
    };


    useEffect(() => {
        const newConversation = location.state?.newConversation as Conversation | undefined;
        if (
            newConversation &&
            userId &&
            companyId &&
            !conversations.some((conv) => conv.employeeId === newConversation.employeeId) &&
            !isInitialized
        ) {
            const initializeNewChat = async () => {
                try {
                    const data = await InitializeChat(companyId || "", newConversation.employeeId, "employee");
                    setConversations((prev) => [
                        ...prev,
                        {
                            ...newConversation,
                            channel: data.channel,
                        },
                    ]);
                    setSelectedEmployeeId(newConversation.employeeId);
                    setIsInitialized(true);
                } catch (error) {
                    console.error("Error initializing chat:", error);
                }
            };
            initializeNewChat();
        }
    }, [location.state, companyId, userId, conversations, isInitialized]);

    const handleInitializeChat = async (employeeId: string, employeeName: string, employeeProfile: string) => {
        if (companyId && !conversations.some((conv) => conv.employeeId === employeeId)) {
            try {
                const data = await InitializeChat(companyId, employeeId, "employee");
                setConversations((prev) => [
                    ...prev,
                    {
                        employeeProfile,
                        employeeId,
                        employeeName,
                        lastMessage: "Chat started",
                        timestamp: new Date().toISOString(),
                        channel: data.channel,
                    },
                ]);
                setSelectedEmployeeId(employeeId);
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        }
    };

    return (
        <div className="bg-[#F6F6F6] min-h-screen">
            <Navbar />
            <div className="mx-4 sm:mx-8 md:mx-12 mt-6">
                <div className="bg-white p-3 sm:p-4 shadow-lg rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                        <IoChevronBackOutline
                            className="w-6 h-6 sm:w-8 sm:h-8 ml-2 sm:ml-3 mr-4 sm:mr-6 cursor-pointer"
                            onClick={() => navigate(-1)}
                        />
                        <h1 className="text-xl sm:text-3xl font-medium">Messaging</h1>
                    </div>
                    {/* <div className="pr-2 sm:pr-10">
                        <button
                            className="bg-orange-600 p-2 sm:p-3 text-white font-bold rounded-lg cursor-pointer"
                            onClick={() => handleInitializeChat("newEmployeeId", "New Employee", "")} // Replace with dynamic logic
                        >
                            <GoPencil className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                    </div> */}
                </div>

                <div className="bg-white mt-4 sm:mt-5 rounded-lg shadow-lg flex flex-col sm:flex-row h-auto sm:h-[calc(100vh-250px)]">

                    <div className="w-full sm:w-1/3 border-r-0 sm:border-r border-gray-300 overflow-y-auto">
                        <div className="bg-white shadow-md rounded-lg p-2 mb-4 flex items-center mx-8  mt-5">
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
                                    key={conv.employeeId}
                                    className={`flex justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${selectedEmployeeId === conv.employeeId ? "bg-gray-100" : ""
                                        }`}
                                    onClick={() => handleSelectConversation(conv.employeeId)}
                                >
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 rounded-full mr-2 sm:mr-3">
                                            <img src={conv.employeeProfile || avathar} alt="" className="w-12 h-12 rounded-full" />
                                        </div>
                                        <div>
                                            <h1 className="text-sm sm:text-base">{conv.employeeName}</h1>
                                            <p className="text-xs sm:text-sm text-gray-500">{conv.lastMessage || "No messages yet"}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs sm:text-sm text-gray-400">{format(new Date(conv.timestamp), 'p')}</span>
                                        {conv.unread && <div className="bg-orange-600 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mt-1" />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 text-sm">No conversations available</p>
                        )}
                    </div>
                    <div className="w-full sm:w-2/3 p-2 sm:p-4 flex flex-col">
                        {selectedEmployeeId && companyId ? (
                            <>
                                <div className="flex justify-between items-center px-4 py-2">
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 rounded-full mr-2 sm:mr-3">
                                            <img src={conversations.find((c) => c.employeeId === selectedEmployeeId)?.employeeProfile || avathar} alt="" className="w-13 h-13 rounded-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <h1 className="font-bold text-sm sm:text-lg">
                                                {conversations.find((c) => c.employeeId === selectedEmployeeId)?.employeeName || "Unknown"}
                                            </h1>
                                            <p className="text-xs sm:text-sm text-gray-600">Online</p>
                                        </div>
                                    </div>
                                    <IoVideocamOutline className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                </div>
                                <div className="h-px bg-gray-400 w-full mt-2" />
                                {/* Scrollable Message Area */}
                                <div className="flex-1 overflow-y-auto p-2 sm:p-4" style={{ maxHeight: "calc(100vh - 300px)" }}>
                                    {messages.length > 0 ? (
                                        messages.map((msg, index) => (
                                            <div
                                                key={index}
                                                className={`mb-1 sm:mb-2 ${msg.senderId === userId ? "text-right" : "text-left"}`}
                                            >
                                                <div
                                                    className={`inline-block p-1 sm:p-2 rounded-lg shadow-md text-sm sm:text-base ${msg.senderId === userId ? "bg-orange-200" : "bg-white"
                                                        }`}
                                                >
                                                    <p>{msg.message}</p>
                                                    <span className="text-xs sm:text-sm text-gray-500 block mt-1">
                                                        {format(new Date(msg.timestamp), 'p')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 text-sm">No messages yet</p>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="h-px bg-gray-400 w-full" />
                                {/* Fixed Input Section */}
                                <div className="flex items-center justify-between px-4 py-2 mt-2">
                                    <IoIosLink className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type a message..."
                                        className="w-2/3 sm:w-3/4 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none text-sm sm:text-base"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="bg-orange-600 text-white p-2 rounded-lg flex items-center justify-center disabled:bg-gray-400"
                                        disabled={!newMessage.trim()}
                                    >
                                        <LuSend className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-gray-500 h-full flex items-center justify-center text-sm sm:text-base">
                                Select a conversation to start chatting
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;