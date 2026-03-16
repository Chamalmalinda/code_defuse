
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLeaderboard } from '../../services/gameService';
import { GiTimeBomb } from 'react-icons/gi';
import { MdArrowBack, MdLeaderboard, MdMilitaryTech } from 'react-icons/md';
import Loading from '../common/Loading';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

const Leaderboard = () => {
    const navigate              = useNavigate();
    const { user }              = useAuth();
    const [scores, setScores]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    useEffect(() => {
        const loadLeaderboard = async () => {
            try {
                const data = await getLeaderboard();
                setScores(data);
            } catch (err) {
                setError('Failed to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };
        loadLeaderboard();
    }, []);

    const getRankColor = (index) => {
        if (index === 0) return 'text-yellow-400';
        if (index === 1) return 'text-gray-400';
        if (index === 2) return 'text-orange-400';
        return 'text-green-400';
    };

    const getRankLabel = (index) => {
        if (index === 0) return <MdMilitaryTech className="text-yellow-400 text-2xl" />;
        if (index === 1) return <MdMilitaryTech className="text-gray-400 text-2xl" />;
        if (index === 2) return <MdMilitaryTech className="text-orange-400 text-2xl" />;
        return <span className={`text-sm font-bold ${getRankColor(index)}`}>#{index + 1}</span>;
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loading message="Loading leaderboard..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-md mx-auto">

                
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white tracking-widest flex items-center gap-2">
                        <MdLeaderboard className="text-green-400" /> LEADER<span className="text-green-400">BOARD</span>
                    </h1>
                </div>

                
                {error && (
                    <div className="bg-red-950 border border-red-800 text-red-400 px-4 py-2 rounded-lg mb-4 text-xs tracking-wide">
                        {error}
                    </div>
                )}

                
                {scores.length === 0 ? (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center shadow-2xl">
                        <GiTimeBomb className="text-green-400 text-5xl mx-auto mb-3"
                            style={{ filter: 'drop-shadow(0 0 6px #4ade80)' }} />
                        <p className="text-gray-500 text-xs tracking-wide">No missions completed yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {scores.map((score, index) => (
                            <div
                                key={index}
                                className={`bg-gray-900 border rounded-xl p-3 flex items-center gap-3
                                            ${score.agentName === user?.agentName
                                                ? 'border-green-500 bg-gray-800'
                                                : 'border-gray-800'}`}
                            >
                                
                                <div className="w-8 flex items-center justify-center">
                                    {getRankLabel(index)}
                                </div>

                                
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${score.agentName === user?.agentName ? 'text-green-400' : 'text-white'}`}>
                                            {score.agentName}
                                        </span>
                                        {score.agentName === user?.agentName && (
                                            <span className="text-xs bg-green-950 border border-green-800 text-green-400 px-2 py-0.5 rounded-md">YOU</span>
                                        )}
                                    </div>
                                    <div className="flex gap-3 text-xs text-gray-600 mt-0.5">
                                        <span>{score.difficulty?.toUpperCase()}</span>
                                        <span>Wires: {score.wiresDefused}</span>
                                        <span>Time: {score.timeRemaining}s</span>
                                    </div>
                                </div>

                                
                                <div className="text-right">
                                    <p className={`font-bold text-base ${getRankColor(index)}`}>{score.score}</p>
                                    <p className="text-gray-600 text-xs">pts</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Leaderboard;