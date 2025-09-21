import { Router } from "express";
import MessageController from "../controller/MessageController.js";

const messageRouter = Router();

messageRouter.post("/send-message", MessageController.sendMessage);
messageRouter.get("/get-mess/:conversationId", MessageController.getMessages);
messageRouter.post("/conversations", MessageController.createConversation);
messageRouter.get("/conversations", MessageController.getConversations);

export { messageRouter };



