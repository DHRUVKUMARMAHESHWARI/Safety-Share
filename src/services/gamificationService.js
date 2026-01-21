import axios from 'axios';

// Mock data for immediate "WOW" factor
const MOCK_LEADERS = [
  { _id: '1', name: 'Alex Driver', points: 15200, level: 'Legend', avatar: 'A', badges: ['🛡️', '🌟'] },
  { _id: '2', name: 'Sarah Miles', points: 12800, level: 'Expert', avatar: 'S', badges: ['⚡'] },
  { _id: '3', name: 'Raj Kumar', points: 10500, level: 'Pro', avatar: 'R', badges: ['👀'] },
  { _id: '4', name: 'Mike Chen', points: 8200, level: 'Scout', avatar: 'M', badges: [] },
  { _id: '5', name: 'Elena G', points: 7100, level: 'Scout', avatar: 'E', badges: [] },
  { _id: '6', name: 'Tom H', points: 6300, level: 'Rookie', avatar: 'T', badges: [] },
  { _id: '7', name: 'Lisa W', points: 5200, level: 'Rookie', avatar: 'L', badges: [] },
  { _id: '8', name: 'Davide B', points: 4100, level: 'Rookie', avatar: 'D', badges: [] },
  { _id: '9', name: 'Jenny K', points: 3000, level: 'Novice', avatar: 'J', badges: [] },
];

const MOCK_STATS = {
  points: 1250,
  level: 'Scout',
  reports: 42,
  alertsRecieved: 128,
  nextLevelPoints: 2000
};

// Base URL configuration (adjust port if needed, assuming /api proxy setup or CORS)
const API_URL = '/api/gamification'; 

export const getLeaderboard = async () => {
    // In a real app, you'd use axios.get(`${API_URL}/leaderboard`);
    // For now, return a promise that resolves to mock data
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: MOCK_LEADERS });
        }, 800);
    });
};

export const getUserStats = async () => {
    // In a real app, you'd use axios.get(`${API_URL}/stats`);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ data: MOCK_STATS });
        }, 500);
    });
};
