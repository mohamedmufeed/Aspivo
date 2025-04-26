import React, { useState } from "react";
import { useSocket } from "../../../hooks/socket";
import { sheduleMeeting } from "../../../services/company/companyMeeting";
import { getMessageHistory, sendMessage } from "../../../services/messageService";
import { Conversation } from "../../../pages/company/CompanyMessages";
interface ITimeModalProps {
  setShowTimeModal: (value: boolean) => void;
  companyId: string;
  selectedUserId: string;
  conversations: Conversation[]
}

export const TimePickerModal: React.FC<ITimeModalProps> = ({ setShowTimeModal, companyId, selectedUserId, conversations }) => {
  const [meetingTime, setMeetingTime] = useState<Date>(new Date());
  const socket = useSocket();
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    setMeetingTime(selected);
  };

  const handleConfirm = () => {
    if (meetingTime) {
      setShowTimeModal(false);
      handleStartVideoCall()
    } else {
      console.log("Error in shedule video call ")
    }
  };

  const getFormattedDateTime = (): string => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');

    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };





  const handleStartVideoCall = async () => {

    if (!companyId || !selectedUserId) {
      console.error("Company ID or Selected User ID is missing");
      return;
    }
    const roomId = `meeting-${companyId}-${Date.now()}`;
    // const companyPeerId = `company-${companyId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const userPeerId = `user-${selectedUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const meetingLink = `${window.location.origin}/video?room=${roomId}&peerId=${userPeerId}`;
    const channel = conversations.find((c) => c.targetId === selectedUserId)?.channel;
    if (channel) {
      if (!socket) return
      const startTime = meetingTime || new Date(Date.now() + 1 * 60 * 1000);
      const meetingData = {
        roomId: roomId,
        peerId: userPeerId,
        startTime: startTime.toISOString(),
        initiatorId: companyId,
        targetId: selectedUserId,
        link: meetingLink,
      }

      const formattedTime = new Date(startTime).toLocaleString();
      const invitationMessage = ` You have a scheduled video call! \n Time: ${formattedTime}\n🔗 Join: ${meetingLink}`;

      try {

        const response = await sheduleMeeting(meetingData)
        if (!response) {
          console.log("Failed to schedule meeting");
          return
        }
        await sendMessage(channel, invitationMessage, companyId);
        const messageData = {
          channel,
          message: invitationMessage,
          imageUrl: undefined,
          senderId: companyId,
          timeStamp: new Date().toISOString(),
        };
        socket.emit("sendMessage", messageData);
        await getMessageHistory(channel);
      } catch (error) {
        console.error("Error initiating video call:", error);
      }
    } else {
      console.error("No channel found for the selected user");
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-xs flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-6 w-80 shadow-2xl">
        <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Meeting Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            defaultValue={getFormattedDateTime()}
            onChange={handleTimeChange}
            min={getFormattedDateTime()}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={() => setShowTimeModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition"
            onClick={handleConfirm}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};