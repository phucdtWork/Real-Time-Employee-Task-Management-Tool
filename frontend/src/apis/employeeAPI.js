import axios from './axios.config';

export const updateProfile = (data) => {
    return axios.put('/employee/update-profile', data)
}

export const getProfile = () => {
    return axios.get('/employee/profile')
}



