import React, { useState } from "react";
interface ITimeModalProps {
  setShowTimeModal: (value: boolean) => void
  onTimeSelect: (time: Date) => void;
  onConfirm: () => void;
}
export const TimePickerModal: React.FC<ITimeModalProps> = ({ setShowTimeModal, onTimeSelect ,onConfirm }) => {
  const [meetingTime, setMeetingTime] = useState<Date>()
  return (
<div className="fixed inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white bg-opacity-50 rounded-lg p-6 w-80">
        <h2 className="text-xl font-semibold mb-4">Schedule Meeting</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Meeting Date & Time</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={meetingTime?.toISOString().slice(0, 16)}
            onChange={(e) => setMeetingTime(new Date(e.target.value))}
            min={new Date().toISOString().slice(0, 16)}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={() => setShowTimeModal(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-orange-600 text-white rounded-md"
            onClick={() => {
              if (meetingTime) {
                onTimeSelect(meetingTime);
                setShowTimeModal(false);
              }
            }}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};