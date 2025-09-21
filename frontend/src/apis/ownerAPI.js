import axios from './axios.config';

export const getAllUsers = () => {
    return axios.get('/owner/get-all-employees');
}

export const updateEmployee = (id, data) => {
    return axios.put(`/owner/update-employee/${id}`, data);
}

export const DeleteEmployee = (id) => {
    return axios.delete(`/owner/delete-employee/${id}`);
}

export const CreateEmployee = (data) => {
    return axios.post('/owner/create-employee', data);
}