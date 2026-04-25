import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api from '../api/axios';

const AxiosInterceptor = ({ children }: { children: any }) => {
    const { getToken } = useAuth();

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            async (config) => {
                const token = await getToken();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
        };
    }, [getToken]);

    return children;
};

export default AxiosInterceptor;
