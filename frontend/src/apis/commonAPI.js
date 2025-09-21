import axios from './axios.config';

export const employeeLogin = (data) => {
    return axios.post('/login', data);
}

export const registerAccount = (data, token) => {
    return axios.put('/register-account', data, {
        params: {
            token: token,
        },
    });
}

export const LoginEmail = (email) => {
    return axios.post('/login-email', { email });
}

export const ValidateAccessCodeEmail = (email, accessCode) => {
    return axios.post('/verify-otp', { email, accessCode });
}

export const getCurrentUser = () => {
    return axios.get('/current-user')
}

export const CreateNewAccessCode = (phoneNumber) => {
    return axios.post('/create-access-code', { phoneNumber });
}

export const ValidateAccessCode = (phoneNumber, accessCode) => {
    return axios.post('/validate-access-code', { phoneNumber, accessCode });
}