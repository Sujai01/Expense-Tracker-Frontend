import axios from 'axios';
const backendUrl = 'https://expense-tracker-backend-dmr6.onrender.com/api'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Adjust to your server port
});

// Automatically add the JWT token to every request if it exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;