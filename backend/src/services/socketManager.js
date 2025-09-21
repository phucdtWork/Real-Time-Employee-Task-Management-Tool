class SocketManager {
    constructor() {
        this.io = null;
        this.userSockets = new Map();
        this.socketUsers = new Map();
    }

    initialize(io) {
        this.io = io;

        this.io.on('connection', (socket) => {

            socket.on('user-connect', (userId) => {
                this.userSockets.set(userId, socket.id);
                this.socketUsers.set(socket.id, userId);
                socket.join(`user_${userId}`);
            });

            socket.on('join-conversation', (conversationId) => {
                socket.join(`conversation_${conversationId}`);
            });

            socket.on('leave-conversation', (conversationId) => {
                socket.leave(`conversation_${conversationId}`);
            });

            socket.on('disconnect', (reason) => {

                const userId = this.socketUsers.get(socket.id);
                if (userId) {
                    this.userSockets.delete(userId);
                    this.socketUsers.delete(socket.id);
                }
            });


        });
    }

    emitToUser(userId, event, data) {
        const socketId = this.userSockets.get(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(event, data);
            return true;
        } else {
            return false;
        }
    }




}

const socketManager = new SocketManager();
export default socketManager;