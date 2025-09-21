import axios from './axios.config';

// manage task for owner
export const getAllTasksForOwner = () => {
    return axios.get('/owner/get-all-tasks');
}

export const createTask = (taskData) => {
    return axios.post('/owner/create-task', taskData);
}

export const updateTask = (taskId, taskData) => {

    return axios.put(`/owner/update-task/${taskId}`, taskData);
}

export const deleteTask = (taskId) => {
    return axios.delete(`/owner/delete-task/${taskId}`);
}


// manage task for employee
export const getEmployeeTasks = () => {
    return axios.get('/employee/my-tasks');
}

export const updateEmployeeTask = (taskId, taskData) => {
    return axios.put(`/employee/update-task/${taskId}`, taskData);
}
