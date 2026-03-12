
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameProvider } from './context/GameContext';
import LoginScreen from './components/auth/LoginScreen';
import RegisterScreen from './components/auth/RegisterScreen';
import MenuScreen from './components/menu/MenuScreen';
import ProfileScreen from './components/menu/ProfileScreen';
import HowToPlay from './components/menu/HowToPlay';
import GameScreen from './components/game/GameScreen';
import Loading from './components/common/Loading';


const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loading message="Authenticating agent..." />
        </div>
    );
    return user ? children : <Navigate to="/" />;
};

const AppRoutes = () => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loading message="Authenticating agent..." />
        </div>
    );

    return (
        <Routes>
            <Route path="/"            element={user ? <Navigate to="/menu" /> : <LoginScreen />} />
            <Route path="/register"    element={user ? <Navigate to="/menu" /> : <RegisterScreen />} />
            <Route path="/menu"        element={<ProtectedRoute><MenuScreen /></ProtectedRoute>} />
            <Route path="/game"        element={<ProtectedRoute><GameScreen /></ProtectedRoute>} />
            <Route path="/profile"     element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
            <Route path="/how-to-play" element={<ProtectedRoute><HowToPlay /></ProtectedRoute>} />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <GameProvider>
                    <AppRoutes />
                </GameProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;