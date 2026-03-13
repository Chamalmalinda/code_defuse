import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiTimeBomb } from 'react-icons/gi';
import { MdEmail, MdLock, MdPerson } from 'react-icons/md';
import Button from '../common/Button';
import Input from '../common/Input';

const RegisterScreen = () => {
    const { register }                = useAuth();
    const navigate                    = useNavigate();
    const [agentName, setAgentName]   = useState('');
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [confirm, setConfirm]       = useState('');
    const [error, setError]           = useState('');
    const [loading, setLoading]       = useState(false);
    const [success, setSuccess]       = useState(false);

    const handleRegister = async () => {
        setError('');
        if (!agentName || !email || !password || !confirm) {
            setError('All fields are required');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        try {
            setLoading(true);
            await register(agentName, email, password);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
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
                    <p className="text-gray-500 text-xs tracking-[0.25em] uppercase">NEW AGENT REGISTRATION</p>
                </div>

               
                {error && (
                    <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

              
                {success && (
                    <div className="bg-green-950 border border-green-800 text-green-400 px-4 py-2 rounded-lg mb-4 text-sm text-center">
                        Agent registered successfully! Redirecting to login...
                    </div>
                )}

             
                {!success && (
                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                                <MdPerson className="text-green-500" /> AGENT NAME
                            </label>
                            <Input
                                placeholder="Agent Smith"
                                value={agentName}
                                onChange={e => setAgentName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                                <MdEmail className="text-green-500" /> AGENT EMAIL
                            </label>
                            <Input
                                type="email"
                                placeholder="agent@defuse.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                                <MdLock className="text-green-500" /> ACCESS CODE
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs mb-1.5 flex items-center gap-1.5 uppercase tracking-widest">
                                <MdLock className="text-green-500" /> CONFIRM ACCESS CODE
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleRegister();
                                    }
                                }}
                            />
                        </div>

                        <Button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full mt-2"
                        >
                            {loading ? 'REGISTERING...' : 'CREATE AGENT'}
                        </Button>
                    </div>
                )}

            
                <p className="text-center text-gray-600 text-sm mt-6">
                    Already an agent?{' '}
                    <Link to="/" className="text-green-400 hover:text-green-300 transition-colors">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;