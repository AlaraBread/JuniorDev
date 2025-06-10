import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { config } from '../config';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();

    const loginMutation = useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            const { data } = await axios.post(`${config.apiUrl}/auth/login`, credentials);
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (credentials: { username: string; password: string }) => {
            await axios.post(`${config.apiUrl}/auth/register`, credentials);
            const { data } = await axios.post(`${config.apiUrl}/auth/login`, credentials);
            return data;
        },
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            queryClient.invalidateQueries({ queryKey: ['auth'] });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const mutation = isLogin ? loginMutation : registerMutation;
        mutation.mutate({ username, password });
    };

    return (
        <div className="login-container">
            <h1>{isLogin ? 'Login' : 'Register'}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">
                    {isLogin ? 'Login' : 'Register'}
                </button>
            </form>
            <button onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
            {(loginMutation.error || registerMutation.error) && (
                <div className="error">
                    {(loginMutation.error || registerMutation.error as Error).message}
                </div>
            )}
        </div>
    );
}