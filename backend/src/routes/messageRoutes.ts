import express from "express";
import {MessageController,} from "../controllers/user/messageController.js";

const router = express.Router();
const messageController = new MessageController();
router.post("/initialize-chat",messageController. initializeChatController);
router.get("/approved-conversations",  messageController.getApprovedConversations);
router.post("/send-message",messageController. sendMessage);
router.get("/chat-history", messageController.getChatHistoryController);

export default router;
