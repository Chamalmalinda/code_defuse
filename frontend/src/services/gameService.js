
import api from './api';


export const saveScore = async (scoreData) => {
    const response = await api.post('/api/game/score', scoreData);
    return response.data;
};


export const getLeaderboard = async () => {
    const response = await api.get('/api/game/leaderboard');
    return response.data;
};


export const getProfile = async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
};