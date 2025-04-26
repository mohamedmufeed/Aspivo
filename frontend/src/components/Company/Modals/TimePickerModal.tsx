import React, { useState } from "react";
interface ITimeModalProps {
  setShowTimeModal: (value: boolean) => void;
  onTimeSelect: (time: Date) => void;
  onConfirm: () => void;
}

export const TimePickerModal: React.FC<ITimeModalProps> = ({
  setShowTimeModal,
  onTimeSelect,
  onConfirm,
}) => {
  const [meetingTime, setMeetingTime] = useState<Date>(new Date());
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value);
    setMeetingTime(selected);
  };

  const handleConfirm = () => {
    if (meetingTime) {
      onTimeSelect(meetingTime); 
      onConfirm(); 
      setShowTimeModal(false); 
    }
  };

  const getFormattedDateTime = () => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-gray-400 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
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