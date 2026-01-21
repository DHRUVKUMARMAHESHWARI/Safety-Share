import API from './api';

export const getDashboardData = async () => {
    const response = await API.get('/community/dashboard');
    return response.data;
};

export const getLeaderboard = async () => {
    const response = await API.get('/community/leaderboard');
    return response.data;
};
