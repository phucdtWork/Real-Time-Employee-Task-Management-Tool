import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';
import bcrypt from 'bcryptjs';

const usersCollection = collection(db, 'users');

export { usersCollection };

class UserService {
    constructor() {
        this.usersCollection = usersCollection;
        this.db = db;
    }

    // Create new user
    async createUser(userData) {
        try {
            const docRef = await addDoc(this.usersCollection, {
                ...userData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'active',
                isComplete: false,
                isDelete: false
            });

            // Get the created document
            const createdDoc = await getDoc(docRef);
            return {
                success: true,
                data: { id: docRef.id, ...createdDoc.data() }
            };
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all users
    async getAllUsers() {
        try {
            const q = query(
                this.usersCollection,
                where('role', '!=', 'owner'));
            const querySnapshot = await getDocs(q);

            const users = [];
            querySnapshot.forEach((doc) => {
                users.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: users.sort((a, b) => b.createdAt - a.createdAt) };
        } catch (error) {
            console.error('Error getting users:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user by ID
    async getUserById(userId) {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    success: true,
                    data: { id: docSnap.id, ...docSnap.data() }
                };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user:', error);
            return { success: false, error: error.message };
        }
    }

    // Get user by email
    async getUserByEmail(email) {
        try {
            const q = query(this.usersCollection, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    success: true,
                    data: { id: doc.id, ...doc.data() }
                };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user by email:', error);
            return { success: false, error: error.message };
        }
    }
    async getUserByUsername(username) {
        try {
            const q = query(this.usersCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    success: true,
                    data: { id: doc.id, ...doc.data() }
                };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user by email:', error);
            return { success: false, error: error.message };
        }
    }


    async getUserByPhoneNumber(phoneNumber) {
        try {
            const q = query(this.usersCollection, where('phoneNumber', '==', phoneNumber));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                return {
                    success: true,
                    data: { id: doc.id, ...doc.data() }
                };
            } else {
                return { success: false, error: 'User not found' };
            }
        } catch (error) {
            console.error('Error getting user by phone number:', error);
            return { success: false, error: error.message };
        }
    }

    // Update user
    async updateUser(userId, updateData) {
        try {
            const docRef = doc(db, 'users', userId);
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });

            const updatedDoc = await getDoc(docRef);
            return {
                success: true,
                data: { id: updatedDoc.id, ...updatedDoc.data() }
            };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, error: error.message };
        }
    }

    async updateEmployeeProfile(email, updateData) {
        try {
            const user = await this.getUserByEmail(email);


            const docRef = doc(db, 'users', user.data.id);
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
            if (!user.success) {
                return { success: false, error: 'User not found' };
            }
            const updatedDoc = await getDoc(docRef);
            return {
                success: true,
                data: { email: user.data.email, ...updatedDoc.data() }
            };
        } catch (error) {
            console.error('Error updating employee profile:', error);
            return { success: false, error: error.message };
        }
    }



    // Delete user
    async deleteUser(userId) {
        try {
            const docRef = doc(db, 'users', userId);
            await deleteDoc(docRef);
            return { success: true, id: userId };
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, error: error.message };
        }
    }

    async authenticateEmployee(username, password) {
        try {

            const q = query(this.usersCollection, where('username', '==', username));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const userData = doc.data();

                const passwordMatch = await bcrypt.compare(password, userData.password);

                if (passwordMatch) {
                    return {
                        success: true,
                        data: { id: doc.id, ...userData }
                    };
                } else {
                    return { success: false, error: 'Username and password do not match in password' };
                }
            } else {
                return { success: false, error: 'Username and password do not match in username' };
            }
        }
        catch (error) {
            console.error('Error during authentication:', error);
            return { success: false, error: error.message };
        }
    }
}

const userService = new UserService();
export default userService;
