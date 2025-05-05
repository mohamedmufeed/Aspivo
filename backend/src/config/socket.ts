
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import logger from "../logger";
import Conversation from "../models/conversations";
declare module "socket.io" {
    interface Socket {
        roomId?: string;
    }
}

const setupSocket = (server: HttpServer) => {
    const io = new SocketServer(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        }
    })

    const userSockets = new Map<string, Map<string, string>>();
    const meetingRooms = new Map<string, Set<string>>();
    const onlineUsers = new Map();
    io.on("connection", (socket) => {
        socket.on("registerUser", (role: string, userId: string) => {

            logger.info(`User ${userId} registered as ${role}`);
            
            if (!userSockets.has(role)) {
                userSockets.set(role, new Map<string, string>());
            }
            
            userSockets.get(role)?.set(userId, socket.id);
            
            if (userId) {
                onlineUsers.set(userId, socket.id);
                socket.broadcast.emit("user-online", { targetId: userId, isOnline: true });
                const onlineUsersList = Array.from(onlineUsers.keys()).map(id => ({
                    targetId: id,
                    isOnline: true
                }));
            }
        });

        socket.on("joinChannel", (channel: string) => {
            socket.join(channel);
        })
        //send message 
        socket.on("sendMessage", async (data: { channel: string, message: string, senderId: string,imageUrl?: string; }) => {
    
            io.to(data.channel).emit("receiveMessage", {
                senderId: data.senderId,
                message: data.message,
                imageUrl: data.imageUrl,
                timeStamp: new Date().toISOString(),
                read: false 
            })
        })

        //join meeting
        // socket.on("joinMeeting", (roomId: string, callback?: (response: { success: boolean; participants?: string[]; error?: string }) => void) => {
        //     try {
        //         if (!roomId || typeof roomId !== "string") {
        //             if (typeof callback === "function") {
        //                 callback({ success: false, error: "Invalid room ID" });
        //             } else {
        //                 logger.warn("No callback provided for joinMeeting with invalid roomId");
        //             }
        //             return;
        //         }

        //         socket.join(roomId);

        //         if (!meetingRooms.has(roomId)) {
        //             meetingRooms.set(roomId, new Set<string>());
        //         }

        //         const roomParticipants = meetingRooms.get(roomId)!;
        //         if (!roomParticipants.has(socket.id)) {
        //             roomParticipants.add(socket.id);
        //         }

        //         socket.roomId = roomId;
        //         socket.to(roomId).emit("userJoined", socket.id);

        //         if (typeof callback === "function") {
        //             callback({
        //                 success: true,
        //                 participants: Array.from(roomParticipants),
        //             });
        //         } else {
        //             logger.warn("No callback provided for joinMeeting");
        //         }
        //     } catch (error) {
        //         logger.error(`Error joining meeting room ${roomId}:`, error);
        //         if (typeof callback === "function") {
        //             callback({ success: false, error: "Failed to join meeting room" });
        //         } else {
        //             logger.error("Error occurred but no callback to report it");
        //         }
        //     }
        // });

        // socket.on("leaveMeeting", (roomId: string, callback: (response: { success: boolean }) => void) => {
        //     if (socket.roomId) {
        //         socket.leave(socket.roomId)
        //         meetingRooms.get(socket.roomId)?.delete(socket.id);
        //         socket.to(socket.roomId).emit("userLeft", socket.id);
        //         logger.info(`${socket.id} left room ${socket.roomId}, Remaining: ${meetingRooms.get(socket.roomId)?.size || 0}`);
        //         if (meetingRooms.get(socket.roomId)?.size === 0) {
        //             meetingRooms.delete(socket.roomId)
        //             logger.info(`Room ${socket.roomId} deleted`);
        //         }
        //         delete socket.roomId;
        //         if (typeof callback === "function") {
        //             callback({ success: true });
        //         } else {
        //             logger.warn("No callback provided for leaveMeeting event");
        //         }
        //     } else if (typeof callback === "function") {
        //         callback({ success: false });
        //     }
        // })



        socket.on("disconnect", (reason: string) => {
            for (const [role, users] of userSockets.entries()) {
              for (const [userId, socketId] of users.entries()) {
                if (socketId === socket.id) {
                  users.delete(userId);
                  if (users.size === 0) userSockets.delete(role);
                  onlineUsers.delete(userId);
                  socket.broadcast.emit("user-offline", { targetId: userId, isOnline: false }); // Consistent payload
                  break;
                }
              }
            }
      
            if (socket.roomId) {
              meetingRooms.get(socket.roomId)?.delete(socket.id);
              socket.to(socket.roomId).emit("userLeft", socket.id);
              if (meetingRooms.get(socket.roomId)?.size === 0) meetingRooms.delete(socket.roomId);
              delete socket.roomId;
            }
          });
    });


    const sendNotification = (role: string, userId: string, message: string) => {
        const socketId = userSockets.get(role)?.get(userId)
        if (socketId) {
            io.to(socketId).emit("notification", message)
        }
    }

    return { io, sendNotification }

}

export default setupSocket;


