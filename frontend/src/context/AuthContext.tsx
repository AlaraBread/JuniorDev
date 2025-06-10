import { createContext, useContext, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { config } from '../config';

interface User {
    id: string;
    username: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: user, isLoading } = useQuery({
        queryKey: ['auth'],
        staleTime: 0,
        queryFn: async () => {
            const token = localStorage.getItem('token');
            if (!token) return null;

            try {
                const { data } = await axios.get(`${config.apiUrl}/protected`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return data.user;
            } catch {
                localStorage.removeItem('token');
                return null;
            }
        }
    });

    return (
        <AuthContext.Provider value={{ user: user || null, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 