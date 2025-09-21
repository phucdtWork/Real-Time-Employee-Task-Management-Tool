import socketManager from "../services/socketManager.js";
import messageService from "../services/messageService.js";
import conversationService from "../services/converSationService.js";
import { verifyToken } from "../utils/jwtConfig.js";
import userService from "../services/user.js";
import formatTimestamp from "../utils/formatTimestamp.js";
class MessageController {
    async sendMessage(req, res) {
        try {
            const { conversationId, sender2Id, messageContent } = req.body;

            const authorization = req?.headers["authorization"];
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            const existingUser = await userService.getUserByEmail(decoded.email);

            if (!conversationId || !messageContent) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }
            const newMessage = await messageService.createMessage({ conversationId, senderId: existingUser?.data.id, message: messageContent });

            const conversations = await conversationService.findConversationByUsers(existingUser?.data.id, sender2Id);

            if (conversations) {
                socketManager.emitToUser(sender2Id, 'new-message', {
                    conversationId,
                    message: newMessage,
                    conversation: {
                        ...conversations,
                        lastMessage: newMessage,
                        lastSenderId: existingUser?.data.id,
                        lastMessageTime: new Date
                    },
                    id: newMessage.id,
                    content: newMessage.message,
                    role: 'assistant',
                    timestamp: newMessage.timestamp,
                });
            }
            return res.status(201).json({ success: true, data: newMessage });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });

        }
    }

    async getMessages(req, res) {
        try {
            const { conversationId } = req.params;

            const authorization = req?.headers["authorization"];
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            const existingUser = await userService.getUserByEmail(decoded.email);

            if (!conversationId) {
                return res.status(400).json({ success: false, message: 'Missing conversationId' });
            }
            const messages = await messageService.getMessagesByConversation(conversationId);

            if (!messages || messages.length === 0) {
                return res.status(200).json({ success: false, data: [] });
            }
            let translatedMessages = messages?.map(msg => ({
                id: msg.id,
                content: msg.message,
                role: msg.senderId === existingUser?.data.id ? 'user' : 'assistant',
                timestamp: msg.timestamp,
            }));

            return res.status(200).json({ success: true, data: translatedMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) });
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    }

    async createConversation(req, res) {
        try {
            const { user2Id } = req.body;

            const authorization = req?.headers["authorization"];
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            const existingUser = await userService.getUserByEmail(decoded.email);
            if (!user2Id) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const existingConversation = await conversationService.findConversationByUsers(existingUser?.data.id, user2Id);
            if (existingConversation) {
                return res.status(200).json({ success: true, data: existingConversation });
            }
            const conversation = await conversationService.createConversation(existingUser?.data.id, user2Id);
            socketManager.emitToUser(user2Id, 'create-conversation', {
                ...conversation
            });
            return res.status(201).json({ success: true, data: conversation });
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    }

    async getConversations(req, res) {
        try {
            const authorization = req?.headers["authorization"];
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            const existingUser = await userService.getUserByEmail(decoded.email);
            if (!existingUser) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const userId = existingUser?.data.id;
            const conversations = await conversationService.getConversationsByUser(userId);

            const sortedConversations = conversations.sort((a, b) => {
                if (!a.lastMessageTime) return 1;
                if (!b.lastMessageTime) return -1;
                return b.lastMessageTime.toMillis() - a.lastMessageTime.toMillis();
            });

            if (!conversations || conversations.length === 0) {
                return res.status(200).json({ success: true, data: [] });
            }

            const translatedConversations = await Promise.all(
                sortedConversations.map(async (conv) => {

                    try {
                        const otherParticipantId = conv.participants.find(p => p !== userId);

                        let otherParticipant = null;
                        if (otherParticipantId) {
                            try {
                                otherParticipant = await userService.getUserById(otherParticipantId);

                            } catch (error) {
                                console.log("Error fetching other participant user by ID:", error);
                            }
                        }

                        return {
                            id: conv.id,
                            name: otherParticipant ? otherParticipant.data.name : "Unknown",
                            isDelete: otherParticipant ? otherParticipant.data.isDelete : false,
                            lastMessage: conv.lastMessage,
                            lastMessageTime: formatTimestamp(conv.lastMessageTime),
                            otherParticipantId: otherParticipantId

                        };
                    } catch (error) {
                        return {
                            ...conv,
                            lastMessage: conv.lastMessage
                        };
                    }
                }));


            return res.status(200).json({ success: true, data: translatedConversations });
        } catch (error) {
            return res.status(500).json({ success: false, message: error });
        }
    }

}

const messageController = new MessageController();

export default messageController;