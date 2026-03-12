
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

    const handleRegister = async () => {
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
            setError('');
            await register(agentName, email, password);
            navigate('/menu');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 border border-green-500 rounded-lg p-8">

                
                <div className="text-center mb-8">
                    <GiTimeBomb className="text-green-400 text-6xl mx-auto mb-2" />
                    <h1 className="text-4xl font-bold text-green-400 mb-2">CODE DEFUSE</h1>
                    <p className="text-gray-400 text-sm">NEW AGENT REGISTRATION</p>
                </div>

                
                {error && (
                    <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

               
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="text-green-400 text-sm mb-1 flex items-center gap-1">
                            <MdPerson /> AGENT NAME
                        </label>
                        <Input
                            placeholder="Agent Smith"
                            value={agentName}
                            onChange={e => setAgentName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-green-400 text-sm mb-1 flex items-center gap-1">
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
                        <label className="text-green-400 text-sm mb-1 flex items-center gap-1">
                            <MdLock /> ACCESS CODE
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-green-400 text-sm mb-1 flex items-center gap-1">
                            <MdLock /> CONFIRM ACCESS CODE
                        </label>
                        <Input
                            type="password"
                            placeholder="••••••••"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleRegister()}
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

                
                <p className="text-center text-gray-500 text-sm mt-6">
                    Already an agent?{' '}
                    <Link to="/" className="text-green-400 hover:text-green-300">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;