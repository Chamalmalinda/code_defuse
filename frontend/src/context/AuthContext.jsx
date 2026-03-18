
import { createContext, useContext, useState, useEffect } from 'react';
import { loginAgent, registerAgent, logoutAgent, googleLoginService } from '../services/authService';
import { getProfile } from '../services/gameService';
import { signInWithGoogle, signOutFromGoogle } from '../firebase';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser]       = useState(null);
    const [token, setToken]     = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const restoreSession = async () => {
        const savedToken = localStorage.getItem('token');
        

        if (!savedToken) {
            setLoading(false);
            return;
        }

        try {
            const data = await getProfile();
            setUser(data.user);
            setToken(savedToken);
        } catch (error) {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
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
    await registerAgent(agentName, email, password);
    };

const logout = async () => {
    try {
        await logoutAgent();
        await signOutFromGoogle();
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }
};

// Google OAuth login
const loginWithGoogle = async () => {
    // Step 1: Firebase Google popup
    const firebaseUser = await signInWithGoogle();
    
    // Step 2: Send Firebase user data to backend — get JWT
    const data = await googleLoginService(firebaseUser);
    
    // Step 3: Set token and user
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
};

    
    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, loginWithGoogle  }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);