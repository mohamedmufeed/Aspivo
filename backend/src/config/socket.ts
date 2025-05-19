
import { Server as HttpServer } from "http";
import { Server as SocketServer } from "socket.io";
import logger from "../logger";
declare module "socket.io" {
    interface Socket {
        roomId?: string;
    }
}

const setupSocket = (server: HttpServer) => {
    const io = new SocketServer(server, {
        cors: {
            origin: "https://www.aspivo.site",
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


