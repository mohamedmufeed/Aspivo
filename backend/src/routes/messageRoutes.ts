import express from "express";
import {initializeChatController,getApprovedConversations,sendMessage,getChatHistoryController,} from "../controllers/user/messageController.js";

const router = express.Router();

router.post("/initialize-chat", initializeChatController);
router.get("/approved-conversations", getApprovedConversations);
router.post("/send-message", sendMessage);
router.get("/chat-history", getChatHistoryController);

export default router;
