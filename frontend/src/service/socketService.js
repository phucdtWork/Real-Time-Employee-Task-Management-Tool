import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.listeners = new Map();
        this.currentUserId = null;
        this.currentConversationId = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    connect(userId) {
        if (this.socket && this.isConnected && this.currentUserId === userId) {
            return this.socket;
        }

        if (this.socket) {
            this.disconnect();
        }

        this.currentUserId = userId;

        this.socket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            upgrade: true,
            rememberUpgrade: true,
            timeout: 20000,
            forceNew: false,
            autoConnect: true,
            withCredentials: false,
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
        });

        this.setupEventHandlers();
        return this.socket;
    }

    setupEventHandlers() {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Emit user connection
            if (this.currentUserId) {
                this.socket.emit('user-connect', this.currentUserId);
            }

            if (this.currentConversationId) {
                this.socket.emit('join-conversation', this.currentConversationId);
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('Connection error:', error.message);
            this.isConnected = false;
            this.reconnectAttempts++;
        });

        this.socket.on('disconnect', (reason) => {
            this.isConnected = false;

            if (reason === 'io server disconnect' || reason === 'io client disconnect') {
                return;
            }
        });



        this.socket.on('new-message', (messageData) => {
            this.emit('new-message', messageData);
        });


        this.socket.on('create-conversation', (messageData) => {
            this.emit('create-conversation', messageData);
        });


    }

    joinConversation(conversationId) {
        if (this.currentConversationId === conversationId) {
            return;
        }

        if (this.currentConversationId) {
            this.leaveConversation(this.currentConversationId);
        }

        this.currentConversationId = conversationId;

        if (this.socket && this.isConnected) {
            this.socket.emit('join-conversation', conversationId);
        } else {
            console.log('Cannot join conversation - not connected');
        }
    }

    leaveConversation(conversationId) {
        if (this.socket && this.isConnected) {
            this.socket.emit('leave-conversation', conversationId);
        }

        if (this.currentConversationId === conversationId) {
            this.currentConversationId = null;
        }
    }

    disconnect() {
        if (this.socket) {
            if (this.currentConversationId) {
                this.leaveConversation(this.currentConversationId);
            }

            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
            this.currentUserId = null;
            this.currentConversationId = null;
        }
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (this.listeners.has(event)) {
            const listeners = this.listeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    getConnectionInfo() {
        if (this.socket) {
            return {
                connected: this.socket.connected,
                id: this.socket.id,
                transport: this.socket.io.engine?.transport?.name,
                userId: this.currentUserId,
                conversationId: this.currentConversationId,
                isConnected: this.isConnected
            };
        }
        return null;
    }

    sendMessage(conversationId, message) {
        if (this.socket && this.isConnected) {
            this.socket.emit('send-message', { conversationId, message });
        } else {
            console.error('Cannot send message - not connected');
        }
    }
}

export default new SocketService();