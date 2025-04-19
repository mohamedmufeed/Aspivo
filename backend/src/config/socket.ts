
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
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
        console.log("A user conccets", socket.id)
        // regitser user
        // socket.on("registerUser", (role: string, userId: string) => {
        //     if (!userSockets.has(role)) {
        //         userSockets.set(role, new Map<string, string>())
        //     }
        //     userSockets.get(role)?.set(userId, socket.id)
        //     if (userId) {
        //         onlineUsers.set(userId, socket.id);
        //         socket.broadcast.emit("user-online", { targetId: userId, isOnline: true }); // Consistent payload
        //         // Send initial online users to the newly connected client
        //         socket.emit("online-users", Array.from(onlineUsers.keys()).map((id) => ({ targetId: id, isOnline: true })));
        //       }

        // })
        socket.on("registerUser", (role: string, userId: string) => {
            // console.log(`User ${userId} registered as ${role}`);
            
            if (!userSockets.has(role)) {
                userSockets.set(role, new Map<string, string>());
            }
            
            userSockets.get(role)?.set(userId, socket.id);
            
            if (userId) {
                onlineUsers.set(userId, socket.id);
                // console.log(`User ${userId} is now online`);
                
                // Broadcast to all clients that this user is online
                socket.broadcast.emit("user-online", { targetId: userId, isOnline: true });
                
                // Send current online users to newly connected client
                const onlineUsersList = Array.from(onlineUsers.keys()).map(id => ({
                    targetId: id,
                    isOnline: true
                }));
            }
        });

        socket.on("joinChannel", (channel: string) => {
            socket.join(channel);
            // console.log(`User ${socket.id} joined channel ${channel}`);
        })
        //send message 
        socket.on("sendMessage", (data: { channel: string, message: string, senderId: string,imageUrl?: string; }) => {
            io.to(data.channel).emit("receiveMessage", {
                senderId: data.senderId,
                message: data.message,
                imageUrl: data.imageUrl,
                timeStamp: new Date().toISOString()
            })
        })

        //join meeting
        socket.on("joinMeeting", (roomId: string, callback?: (response: { success: boolean; participants?: string[]; error?: string }) => void) => {
            try {
                if (!roomId || typeof roomId !== "string") {
                    if (typeof callback === "function") {
                        callback({ success: false, error: "Invalid room ID" });
                    } else {
                        console.warn("No callback provided for joinMeeting with invalid roomId");
                    }
                    return;
                }

                socket.join(roomId);

                if (!meetingRooms.has(roomId)) {
                    meetingRooms.set(roomId, new Set<string>());
                }

                const roomParticipants = meetingRooms.get(roomId)!;
                if (!roomParticipants.has(socket.id)) {
                    roomParticipants.add(socket.id);
                }

                socket.roomId = roomId;
                socket.to(roomId).emit("userJoined", socket.id);

                if (typeof callback === "function") {
                    callback({
                        success: true,
                        participants: Array.from(roomParticipants),
                    });
                } else {
                    console.warn("No callback provided for joinMeeting");
                }
            } catch (error) {
                console.error(`Error joining meeting room ${roomId}:`, error);
                if (typeof callback === "function") {
                    callback({ success: false, error: "Failed to join meeting room" });
                } else {
                    console.error("Error occurred but no callback to report it");
                }
            }
        });

        socket.on("offer", ({ roomId, offer }: { roomId: string; offer: RTCSessionDescriptionInit }) => {
            if (!roomId || !offer) return
            console.log(`Offer from ${socket.id} in room ${roomId}`);
            socket.to(roomId).emit("offer", { offer, sender: socket.id })
        })

        socket.on("answer", ({ roomId, answer }: { roomId: string, answer: RTCSessionDescriptionInit }) => {
            if (!roomId || !answer) return
            console.log(`Answer from ${socket.id} in room ${roomId}`);
            socket.to(roomId).emit("answer", { answer, sender: socket.id })
        })

        socket.on("iceCandidate", ({ roomId, candidate }: { roomId: string; candidate: RTCSessionDescriptionInit }) => {
            if (!roomId || !candidate) return
            console.log(`ICE candidate from ${socket.id} in room ${roomId}`);
            socket.to(roomId).emit("iceCandidate", { candidate, sender: socket.id });
        })


        socket.on("leaveMeeting", (roomId: string, callback: (response: { success: boolean }) => void) => {
            if (socket.roomId) {
                socket.leave(socket.roomId)
                meetingRooms.get(socket.roomId)?.delete(socket.id);
                socket.to(socket.roomId).emit("userLeft", socket.id);
                console.log(`${socket.id} left room ${socket.roomId}, Remaining: ${meetingRooms.get(socket.roomId)?.size || 0}`);
                if (meetingRooms.get(socket.roomId)?.size === 0) {
                    meetingRooms.delete(socket.roomId)
                    console.log(`Room ${socket.roomId} deleted`);
                }
                delete socket.roomId;
                if (typeof callback === "function") {
                    callback({ success: true });
                } else {
                    console.warn("No callback provided for leaveMeeting event");
                }
            } else if (typeof callback === "function") {
                callback({ success: false });
            }
        })
        socket.on("disconnect", (reason: string) => {
            console.log("User disconnected:", socket.id, "Reason:", reason);
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


