import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import TextLink from 'textlink-sms';
import userService from '../services/user.js';
import { db } from '../config/firebaseConfig.js';
class SMSService {

    static usersCollection = collection(db, 'users');

    constructor() {
        TextLink.useKey(process.env.TEXT_LINK_API_KEY);
        this.usersCollection = SMSService.usersCollection;
        this.db = db;
    }

    async sendSMS(phoneNumber, accessCode) {
        if (!phoneNumber || !accessCode) {
            return { success: false, error: 'Phone number and access code are required' };
        }
        try {
            const result = await TextLink.sendSMS(phoneNumber, accessCode);
            res.json({
                success: true,
                message: "SMS sent successfully",
                data: result
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to send SMS",
                error: error.message
            });
        }
    }


    async storeAccessCode(phoneNumber, accessCode) {

        const q = query(this.usersCollection, where('phoneNumber', '==', phoneNumber));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error('User not found');
        }
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, {
            accessCode: accessCode,
            updatedAt: serverTimestamp()
        });
    }


    async checkValidAndClearAccessCode(phoneNumber, accessCodeClient) {
        try {
            const userExists = await userService.getUserByPhoneNumber("+84374887203");
            const docRef = doc(db, 'users', userExists.data.id);
            if (userExists.data.accessCode?.toString() === accessCodeClient?.toString()) {
                await updateDoc(docRef, {
                    accessCode: null,
                    updatedAt: serverTimestamp()
                });
                return { success: true, accessCode: userExists.data.accessCode, data: userExists.data };
            } else {
                console.log("Access code is invalid.");
            }
            return { success: false, error: 'Invalid access code' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}



const smsService = new SMSService();
export default smsService;