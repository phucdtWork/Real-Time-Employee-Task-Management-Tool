import { collection, doc, addDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';
import { db } from '../config/firebaseConfig.js';


const tasksCollection = collection(db, 'tasks');

class TaskService {
    constructor() {
        this.tasksCollection = tasksCollection;
        this.db = db;
    }

    // Create new task
    async createTask(taskData) {
        try {
            const docRef = await addDoc(this.tasksCollection, {
                ...taskData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                status: 'pending'
            });
            // Get the created document
            const createdDoc = await getDoc(docRef);
            return {
                success: true,
                data: { id: docRef.id, ...createdDoc.data() }
            };
        } catch (error) {
            console.error('Error creating task:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all tasks
    async getAllTasks() {
        try {
            const q = query(this.tasksCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            const tasks = [];
            querySnapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: tasks };
        } catch (error) {
            console.error('Error getting tasks:', error);
            return { success: false, error: error.message };
        }
    }

    //get task by assignedTo
    async getTasksByAssignedTo(userId) {
        try {
            const q = query(this.tasksCollection, where('assignedTo', '==', userId));
            const querySnapshot = await getDocs(q);
            const tasks = [];
            querySnapshot.forEach((doc) => {
                tasks.push({ id: doc.id, ...doc.data() });
            });
            return { success: true, data: tasks };
        } catch (error) {
            console.error('Error getting tasks by assignedTo:', error);
            return { success: false, error: error.message };
        }
    }

    //delete task by id
    async deleteTask(id) {
        try {
            const docRef = doc(this.tasksCollection, id);
            await deleteDoc(docRef);
            return { success: true };
        } catch (error) {
            console.error('Error deleting task:', error);
            return { success: false, error: error.message };
        }
    }

    //update task by id
    async updateTask(id, updateData) {
        try {
            const docRef = doc(this.tasksCollection, id);
            await updateDoc(docRef, {
                ...updateData,
                updatedAt: serverTimestamp()
            });
            const updatedDoc = await getDoc(docRef);
            return { success: true, data: { id: updatedDoc.id, ...updatedDoc.data() } };
        } catch (error) {
            console.error('Error updating task:', error);
            return { success: false, error: error.message };
        }
    }
}

const taskService = new TaskService();
export default taskService;