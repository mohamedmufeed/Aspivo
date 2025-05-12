import express from "express";
import {MessageController,} from "../controllers/user/messageController";
import protect from "../middleware/authMiddlwware";
import { MessageService } from "../services/messageService";
import { MessageRepostries } from "../repositories/messageRepostries";

const router = express.Router();
const messageRepositories= new MessageRepostries()
const messageService= new MessageService(messageRepositories)
const messageController = new MessageController(messageService);

router.post("/chats", protect, messageController.initializeChatController);
router.get("/chats/approved", protect, messageController.getApprovedConversations);
router.post("/chats/messages", protect, messageController.sendMessage);
router.get("/chats/messages", protect, messageController.getChatHistoryController);
router.post("/chats/markRead", protect, messageController.markConversationRead);
router.get("/chats/unreadcount/:id",protect, messageController.getUnreadMessageCount)


export default router;
