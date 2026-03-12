
import { createContext, useContext, useState, useEffect } from 'react';
import { loginAgent, registerAgent } from '../services/authService';
import { getProfile } from '../services/gameService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const restoreSession = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    
                    const data = await getProfile();
                    setUser(data.user);
                    setToken(savedToken);
                } catch (error) {
                    
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            setLoading(false);
        };
        restoreSession();
    }, []);

    const login = async (email, password) => {
        const data = await loginAgent(email, password);
        setToken(data.token);
        setUser(data.user);
        
        localStorage.setItem('token', data.token);
    };

    const register = async (agentName, email, password) => {
        const data = await registerAgent(agentName, email, password);
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);