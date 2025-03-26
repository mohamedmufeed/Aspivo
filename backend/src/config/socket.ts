import { Server as HttpServer } from "http";
import { use } from "passport";
import { Server as SocketServer } from "socket.io";

const setupSocket=(server:HttpServer)=>{
    const io= new SocketServer(server,{
        cors:{
            origin:"http://localhost:5173",
            methods:["GET","POST"],
            credentials: true,
        }
    })
    const userSockets= new Map<string, Map<string,string>>();
    io.on("connection",(socket)=>{
        // console.log("A user conccets",socket.id)

        socket.on("registerUser",(role:string,userid:string)=>{
            if(!userSockets.has(role)){
                userSockets.set(role, new Map<string,string>())
            }
            userSockets.get(role)?.set(userid,socket.id)
        })

        socket.on("disconnect",()=>{
            // console.log("User disconnected:", socket.id);
            for(const [role,users]of userSockets.entries()){
                for(const [userId,socketId] of users.entries()){
                    if(socketId===socket.id){
                        users.delete(userId)
                        if (users.size === 0) {
                            userSockets.delete(role);
                          }
                          break;
                    }
                }
            }
        })
    })

 const sendNotification=(role:string,userId:string,message:string)=>{
    const socketId=userSockets.get(role)?.get(userId)
    if(socketId){
        io.to(socketId).emit("notification",message)   
    }
 }

 return{io,sendNotification}

}

export default setupSocket;


