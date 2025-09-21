import {
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    query,
    where,
    serverTimestamp,
    getDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';

const messagesCollection = collection(db, 'messages');

class MessageService {
    constructor() {
        this.messagesCollection = messagesCollection;
        this.db = db;
    }

    async createMessage(data) {

        try {
            const newMessage = {
                conversationId: data.conversationId,
                senderId: data.senderId,
                message: data.message,
                timestamp: serverTimestamp(),

            };
            const docRef = await addDoc(this.messagesCollection, newMessage);
            const createdMessage = await getDoc(docRef);

            await this.updateLastMessage(data.conversationId, data.message, data.senderId);

            return { id: docRef.id, ...createdMessage.data() };
        } catch (error) {
            throw new Error('Error creating message: ' + error.message);
        }
    }

    async updateLastMessage(conversationId, message, senderId) {
        try {
            const conversationRef = doc(this.db, 'conversations', conversationId);
            await updateDoc(conversationRef, {
                lastMessage: message,
                lastUpdated: serverTimestamp(),
                lastSenderId: senderId,
                lastMessageTime: serverTimestamp()
            });
        } catch (error) {
            console.error('Error updating last message: ', error);
        }
    }

    async getMessagesByConversation(conversationId) {
        try {
            const q = query(this.messagesCollection, where('conversationId', '==', conversationId));
            const querySnapshot = await getDocs(q);
            const messages = [];
            querySnapshot.forEach((doc) => {
                messages.push({ id: doc.id, ...doc.data() });
            });
            return messages.sort((a, b) => a.timestamp - b.timestamp);
        } catch (error) {
            throw new Error('Error fetching messages: ' + error.message);
        }
    }
}

const messageService = new MessageService();
export default messageService;