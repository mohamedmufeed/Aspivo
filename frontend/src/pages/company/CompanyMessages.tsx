import React, { useState, useEffect, useRef } from "react";
import ComapanyHeader from "../../components/Company/ComapanyHeader";
import CompanySidebar from "../../components/Company/ComapnySidebar";
import { IoIosSearch } from "react-icons/io";
import person from "../../assets/person_1.jpg";
import { IoVideocamOutline } from "react-icons/io5";
import { IoIosLink } from "react-icons/io";
import { LuSend } from "react-icons/lu";
import { getConversations, getMessageHistory, sendMessage, InitializeChat } from "../../services/messageService";
import { useLocation } from "react-router-dom";
import { companyByuserId } from "../../services/company/companyProfile";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { io } from "socket.io-client";
import { format } from 'date-fns';

interface ChatMessage {
    senderId: string;
    message: string;
    timestamp: string;
}

interface Conversation {
    
    targetId: string;
    targetName: string;
    lastMessage: string;
    targetProfile:string
    timestamp: string;
    unread?: boolean;
    channel: string;
}

const CompanyMessages = () => {
    const [selected, setSelected] = useState<string | undefined>("Messages");
    const [heading, setHeading] = useState("Messages");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [companyId, setCompanyId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const socket = io("http://localhost:5001", { 
        autoConnect: false, 
    });

    const user = useSelector((state: RootState) => state.auth.user);
    const userId = user?._id || "";

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await companyByuserId(userId);
                setCompanyId(response.company.company._id);
                console.log("Fetched companyId:", response.company.company._id);
            } catch (error) {
                console.error("Error fetching company:", error);
            }
        };
        fetchCompany();
    }, [userId]);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!companyId) {
                console.log("companyId is not set");
                return;
            }

            try {
                const data = await getConversations(companyId, "company");
                console.log("Raw getConversations response:", data);

                if (!Array.isArray(data)) {
                    console.warn("Expected array from getConversations, got:", data);
                    return;
                }

                let uniqueConversations = data.reduce((unique: Conversation[], current: any) => {
                    if (!unique.some((conv) => conv.targetId === current.targetId)) {
                        unique.push({
                            targetId: current.targetId,
                            targetName: current.targetName,
                            targetProfile:current.targetProfile,
                            lastMessage: current.lastMessage || "",
                            timestamp: current.timestamp,
                            unread: current.unread || false,
                            channel: current.channel,
                        });
                    }
                    return unique;
                }, []);

                const newConversation = location.state?.newConversation as Conversation | undefined;
                console.log("Navigation state newConversation:", newConversation);

                if (newConversation) {
                    const index = uniqueConversations.findIndex(conv => conv.targetId === newConversation.targetId);

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
                    console.log("Selected User ID:", firstUserId);
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
        if (selectedUserId && conversations.length > 0) {
            socket.connect();
            let channel = conversations.find((c) => c.targetId === selectedUserId)?.channel;
            console.log("Fetching history for channel:", channel);

            const fetchHistory = async () => {
                if (channel) {
                    try {
                        const data = await getMessageHistory(channel);
                        console.log("Fetched messages:", data);
                        if (data) setMessages(data);
                    } catch (error) {
                        console.error("Error fetching message history:", error);
                    }
                } else {
                    console.log("No channel found for selectedUserId:", selectedUserId);
                }
            };

            fetchHistory();

            if (channel) {
                socket.emit("joinChannel", channel);
                socket.on("receiveMessage", (message: ChatMessage) => {
                    console.log("Received message:", message);
                    setMessages((prev) => [...prev, message]);
                });
            }

            return () => {
                if (channel) {
                    socket.off("receiveMessage");
                    socket.emit("leaveChannel", channel);
                }
            };
        }
    }, [selectedUserId, conversations]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() && selectedUserId && companyId) {
            const channel = conversations.find((c) => c.targetId === selectedUserId)?.channel;
            if (channel) {
                try {
                    await sendMessage(channel, newMessage, companyId);
                    socket.emit("sendMessage", { channel, message: newMessage, senderId: companyId });
                    setNewMessage("");
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

    const handleInitializeChat = async (userId: string, userName: string) => {
        if (companyId) {
            try {
                const data = await InitializeChat(companyId, userId, "company");
                console.log("the data from inti",data)
                if (data && data.channel) {
                    setConversations((prev) => [
                        ...prev,
                        {
                            targetProfile:userId,// not correct  i want  to change
                            targetId: userId,
                            targetName: userName,
                            lastMessage: "Chat started",
                            timestamp: new Date().toISOString(),
                            channel: data.channel,
                        },
                    ]);
                    setSelectedUserId(userId);
                }
            } catch (error) {
                console.error("Error initializing chat:", error);
            }
        }
    };

    return (
        <div className="flex min-h-screen">
            <CompanySidebar setSelected={setSelected} />
            <div className="bg-[#F6F6F6] w-full flex flex-col" style={{ fontFamily: "DM Sans, sans-serif" }}>
                <ComapanyHeader heading={heading} />
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
                                    className={`flex justify-between items-center px-4 py-3 hover:bg-gray-100 cursor-pointer ${selectedUserId === conv.targetId ? "bg-gray-100" : ""
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
                                            <p className="text-xs sm:text-sm text-gray-600">{conv.lastMessage}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs sm:text-sm text-gray-400">
                                            {format(new Date(conv.timestamp), 'p')}
                                        </span>
                                        {conv.unread && <div className="bg-orange-600 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full mt-1" />}
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
                                            src={conversations.find((c)=>c.targetId===selectedUserId)?.targetProfile||person}
                                            alt="User"
                                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-2 sm:mr-3"
                                        />
                                        <div className="space-y-1">
                                            <h1 className="font-bold text-sm sm:text-lg">
                                                {conversations.find((c) => c.targetId === selectedUserId)?.targetName || "Unknown"}
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
                                        messages.map((msg) => (
                                            <div
                                                key={`${msg.timestamp}-${msg.senderId}`}
                                                className={`flex mb-2 ${msg.senderId === companyId ? "justify-end" : "justify-start"
                                                    }`}
                                            >
                                                <div
                                                    className={`p-2 rounded-lg max-w-xs sm:max-w-md ${msg.senderId === companyId
                                                            ? "bg-orange-200 text-black"
                                                            : "bg-orange-600 text-white"
                                                        }`}
                                                >
                                                    <p className="text-sm sm:text-base">{msg.message}</p>

                                                    <span className={`text-sm sm:text-sm  block mt-1 ${msg.senderId===companyId?"text-gray-500":" text-white"}`}>
                                                    {format(new Date(msg.timestamp), 'p')}
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
                                    <IoIosLink className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
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
                                        disabled={!newMessage.trim()}
                                    >
                                        <LuSend className="w-5 h-5 sm:w-6 sm:h-6" />
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