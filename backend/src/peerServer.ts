
import { PeerServer } from "peer";

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
  allow_discovery: true,
});

peerServer.on("connection", (client) => {
  console.log("Peer connected:", client.getId());
});
