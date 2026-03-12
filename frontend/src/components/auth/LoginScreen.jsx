
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiBomb } from 'react-icons/gi';
import { MdEmail, MdLock } from 'react-icons/md';
import Button from '../common/Button';
import Input from '../common/Input';

const LoginScreen = () => {
    const { login }               = useAuth();
    const navigate                = useNavigate();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('All fields are required');
            return;
        }
        try {
            setLoading(true);
            setError('');
            await login(email, password);
            navigate('/menu');
        } catch (err) {
            setError('Invalid credentials. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 border border-green-500 rounded-lg p-8">

               
                <div className="text-center mb-8">
                    <GiBomb className="text-green-400 text-6xl mx-auto mb-2" />
                    <h1 className="text-4xl font-bold text-green-400 mb-2">CODE DEFUSE</h1>
                    <p className="text-gray-400 text-sm">AGENT AUTHENTICATION REQUIRED</p>
                </div>

                
                {error && (
                    <div className="bg-red-900 border border-red-500 text-red-300 px-4 py-2 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                
                <div className="flex flex-col gap-4">
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
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
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

                
                <p className="text-center text-gray-500 text-sm mt-6">
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