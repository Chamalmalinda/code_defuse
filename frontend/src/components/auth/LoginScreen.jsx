// Login Screen - Agent authentication UI
// Virtual Identity - agent logs in to establish their identity
// Supports both regular login and Google OAuth
// Reference: React docs - https://react.dev/reference/react/useState
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiTimeBomb } from 'react-icons/gi';
import { MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginScreen = () => {
    const { login, loginWithGoogle }  = useAuth();
    const navigate                    = useNavigate();
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError('All fields are required');
            return;
        }
        try {
            setLoading(true);
            await login(email, password);
            navigate('/menu');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            setError('');
            await loginWithGoogle();
            navigate('/menu');
        } catch (err) {
            setError('Google login failed. Try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                {/* Header */}
                <div className="text-center mb-8">
                    <GiTimeBomb
                        className="text-green-400 text-7xl mx-auto mb-3 animate-glow"
                        style={{ filter: 'drop-shadow(0 0 10px #4ade80)' }}
                    />
                    <h1 className="text-4xl font-bold text-white mb-1 tracking-widest">
                        CODE <span className="text-green-400">DEFUSE</span>
                    </h1>
                    <p className="text-gray-600 text-xs tracking-[0.25em]">AGENT AUTHENTICATION REQUIRED</p>
                </div>

                {/* Error box */}
                {error && (
                    <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-green-400 text-xs mb-1 flex items-center gap-1 tracking-widest">
                            <MdEmail /> AGENT EMAIL
                        </label>
                        <Input
                            type="email"
                            placeholder="agent@defuse.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-green-400 text-xs mb-1 flex items-center gap-1 tracking-widest">
                            <MdLock /> ACCESS CODE
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleLogin();
                                }
                            }}
                        />
                    </div>

                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full mt-2"
                    >
                        {loading ? 'AUTHENTICATING...' : 'BEGIN MISSION'}
                    </Button>

                    {/* Divider */}
                    <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="h-1 text-gray-600 text-xs">OR</span>
                        <div className="flex-1 h-px bg-gray-700" />
                    </div>

                    {/* Google Login */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={googleLoading}
                        className="w-full h-7.5 flex items-center justify-center gap-2 bg-gray-800 
                                   border border-gray-700 hover:border-gray-500 text-white font-bold text-xs 
                                   py-1.5 px-3 rounded-lg transition-all duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="text-xl" />
                        {googleLoading ? 'CONNECTING...' : 'CONTINUE WITH GOOGLE'}
                    </button>
                </div>

                {/* Register link */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    New agent?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;