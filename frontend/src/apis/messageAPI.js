import axios from './axios.config';


export const sendMessage = (data) => {
    return axios.post('/message/send-message', data, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export const getMessages = (conversationId) => {
    return axios.get(`/message/get-mess/${conversationId}`);
}

export const createConversation = (user2Id) => {
    return axios.post('/message/conversations', { user2Id });
}

export const getConversations = () => {
    return axios.get(`/message/conversations`);
}

export const getConversationById = (conversationId) => {
    return axios.get(`/message/conversations/${conversationId}`);
}
