import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add Clerk token
// Request interceptor to add Clerk token
// NOTE: The token injection is now handled by the AxiosInterceptor component in React
// which uses the useAuth hook to get a fresh token for every request.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
