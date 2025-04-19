import express from "express";
import {MessageController,} from "../controllers/user/messageController";
import protect from "../middleware/authMiddlwware";

const router = express.Router();
const messageController = new MessageController();
// router.post("/initialize-chat",messageController. initializeChatController);
// router.get("/approved-conversations", protect, messageController.getApprovedConversations);
// router.post("/send-message",messageController. sendMessage);
// router.get("/chat-history",protect, messageController.getChatHistoryController);




router.post("/chats", protect, messageController.initializeChatController);
router.get("/chats/approved", protect, messageController.getApprovedConversations);
router.post("/chats/messages", protect, messageController.sendMessage);
router.get("/chats/messages", protect, messageController.getChatHistoryController);


export default router;
