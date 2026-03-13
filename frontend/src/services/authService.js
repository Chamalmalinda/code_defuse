
import axios from 'axios';
import { API_URL } from '../utils/constants';

const authApi = axios.create({
    baseURL:         import.meta.env.VITE_BACKEND_URL,
    withCredentials: true, 
});


export const registerAgent = async (agentName, email, password) => {
    const response = await authApi.post('/api/auth/register', { agentName, email, password });
    return response.data;
};


export const loginAgent = async (email, password) => {
    const response = await authApi.post('/api/auth/login', { email, password });
    return response.data;
};


export const logoutAgent = async () => {
    const response = await authApi.post('/api/auth/logout');
    return response.data;
};