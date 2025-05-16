import { io } from "socket.io-client";

const socket = io("/api/", {
    withCredentials: true,
  });
  
  export const registerUserSocket = (role: string, userId: string) => {
    socket.emit("registerUser", role, userId);
  };

  export default socket