import {
    collection,
    doc,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    orderBy,
    or
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';

class conversationsService {
    constructor() {
        this.conversationsCollection = collection(db, 'conversations');
    }

    async createConversation(userId1, userId2) {
        try {


            const newConversation = {
                participants: [userId1, userId2],
                createdAt: serverTimestamp(),
                lastMessage: '',
                lastMessageTime: serverTimestamp(),
                lastSenderId: null
            };
            const docRef = await addDoc(this.conversationsCollection, newConversation);
            return { id: docRef.id, ...newConversation };
        } catch (error) {
            console.error('Error creating conversation: ', error);
        }
    }

    async findConversationByUsers(userId1, userId2) {
        try {
            const q = query(
                this.conversationsCollection,
                where('participants', 'array-contains', userId1),
            );

            const querySnapshot = await getDocs(q);

            let existingConversation = null;

            if (!querySnapshot.empty) {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.participants.includes(userId2)) {
                        existingConversation = { id: doc.id, ...data };
                    }
                });
            }
            return existingConversation;
        } catch (error) {
            console.error('Error fetching conversation: ', error);
        }
    }

    async getConversationsByUser(userId) {
        try {
            const q = query(
                this.conversationsCollection,
                where('participants', 'array-contains', userId));
            const querySnapshot = await getDocs(q);
            const conversations = [];
            querySnapshot.forEach((doc) => {
                conversations.push({ id: doc.id, ...doc.data() });
            });
            return conversations;
        } catch (error) {
            console.error('Error fetching conversations: ', error);
        }
    }

}

const conversationService = new conversationsService();
export default conversationService;