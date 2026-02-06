import axios, { InternalAxiosRequestConfig } from 'axios';
import { auth } from '../firebaseConfig';

// Replace with your local IP for physical device testing, or 'http://localhost:3000' for emulator
// Use environment variable for flexibility
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const client = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Auth Token to every request
client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const user = auth.currentUser;
        if (user) {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: any) => {
        if (error.response) {
            console.error('API Error Response:', error.response.status, error.response.data);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default client;
