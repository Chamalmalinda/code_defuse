
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

export const checkDailyChallenge = async () => {
    const response = await api.get('/api/game/daily/check');
    return response.data;
};

export const saveDailyScore = async (scoreData) => {
    const response = await api.post('/api/game/daily/score', scoreData);
    return response.data;
};