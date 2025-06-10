import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { config } from '../config';

interface User {
    id: string;
    username: string;
}

export default function Home() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        enabled: !!user,
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const { data } = await axios.get<{ users: User[] }>(`${config.apiUrl}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return data.users;
        }
    });

    const logoutMutation = useMutation({
        mutationFn: async () => {
            const token = localStorage.getItem('token');
            await axios.post(`${config.apiUrl}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            localStorage.removeItem('token');
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/login');
        }
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <div className="app">
            <header>
                <h1>Welcome, {user?.username}!</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>

            <main>
                <h2>Registered Users</h2>
                {isLoading ? (
                    <p>Loading users...</p>
                ) : (
                    <ul>
                        {users?.map(user => (
                            <li key={user.id}>
                                {user.username} (ID: {user.id})
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    );
} 