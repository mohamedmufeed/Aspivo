
import { PeerServer } from "peer";
import logger from "./logger";

const peerServer = PeerServer({
  port: 9000,
  path: "/peerjs",
  allow_discovery: true,
  
});

peerServer.on("connection", (client) => {
  logger.info("Peer connected:", client.getId());
});
