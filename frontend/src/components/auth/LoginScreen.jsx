import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiTimeBomb } from 'react-icons/gi';
import { MdEmail, MdLock } from 'react-icons/md';
import Button from '../common/Button';

const LoginScreen = () => {
    const { login }             = useAuth();
    const navigate              = useNavigate();
    const emailRef              = useRef('');
    const passwordRef           = useRef('');
    const [error, setError]     = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        const email    = emailRef.current.value;
        const password = passwordRef.current.value;

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
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                
                <div className="text-center mb-8">
                    <GiTimeBomb className="text-green-400 text-6xl mx-auto mb-2" />
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">
                        CODE <span className="text-green-400">DEFUSE</span>
                    </h1>
                    <p className="text-gray-500 text-xs tracking-[0.25em] uppercase">AGENT AUTHENTICATION REQUIRED</p>
                </div>

                
                {error && (
                    <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                            <MdEmail className="text-green-500" /> AGENT EMAIL
                        </label>
                        <input
                            ref={emailRef}
                            type="email"
                            placeholder="agent@defuse.com"
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700
                                       text-gray-100 placeholder-gray-600 outline-none text-sm
                                       focus:border-green-500 focus:ring-1 focus:ring-green-500
                                       transition-all duration-200"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                            <MdLock className="text-green-500" /> ACCESS CODE
                        </label>
                        <input
                            ref={passwordRef}
                            type="password"
                            placeholder="••••••••"
                            onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleLogin();
                                }
                            }}
                            className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700
                                       text-gray-100 placeholder-gray-600 outline-none text-sm
                                       focus:border-green-500 focus:ring-1 focus:ring-green-500
                                       transition-all duration-200"
                        />
                    </div>

                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full mt-2"
                    >
                        {loading ? 'AUTHENTICATING...' : 'BEGIN MISSION'}
                    </Button>
                </div>

                
                <p className="text-center text-gray-600 text-sm mt-6">
                    New agent?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300 transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;