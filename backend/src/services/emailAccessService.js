import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';
import nodemailer from 'nodemailer';
import userService from './user.js';


class EmailAccessCode {

    static usersCollection = collection(db, 'users');


    static async storeAccessCode(email, accessCode) {
        const q = query(this.usersCollection, where('email', '==', email));
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

    static async sendAccessCodeEmail(email, accessCode) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_SERVICE,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_SERVICE,
            to: email,
            subject: 'Your Access Code',
            html: `Your access code is: <strong>${accessCode}</strong>. <br/> 
             Please use this code to log in.`,
        };

        try {
            await transporter.sendMail(mailOptions);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    static async checkValidAndClearAccessCode(email, accessCodeClient) {
        try {
            const userExists = await userService.getUserByEmail(email);
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

export default EmailAccessCode;