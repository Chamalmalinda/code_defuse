
import api from './api';


export const registerAgent = async (agentName, email, password) => {
    const response = await api.post('/api/auth/register', { agentName, email, password });
    return response.data;
};


export const loginAgent = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
};