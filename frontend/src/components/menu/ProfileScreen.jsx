
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../services/gameService';
import { GiRank2, GiTimeBomb } from 'react-icons/gi';
import { MdCheckCircle, MdDangerous, MdArrowBack, MdSportsScore, MdGamepad, MdRefresh, MdEmojiEvents } from 'react-icons/md';
import Loading from '../common/Loading';
import Button from '../common/Button';

const ProfileScreen = () => {
    const { user, updateUser }              = useAuth();
    const navigate                          = useNavigate();
    const [recentGames, setRecentGames]     = useState([]);
    const [highestScore, setHighestScore]   = useState(null);
    const [loading, setLoading]             = useState(true);
    const [refreshKey, setRefreshKey]       = useState(0);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await getProfile();
                setRecentGames(data.recentGames);
                setHighestScore(data.highestScore);
                updateUser(data.user);
            } catch (error) {
                console.error('Profile load failed:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [refreshKey]);

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loading message="Loading agent profile..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-md mx-auto">

               
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white tracking-widest">
                        AGENT <span className="text-green-400">PROFILE</span>
                    </h1>
                    <Button variant="secondary" onClick={() => setRefreshKey(k => k + 1)} className="ml-auto">
                        <MdRefresh className="text-xl" />
                    </Button>
                </div>

                
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-4 shadow-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <GiTimeBomb className="text-green-400 text-4xl" />
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">{user?.agentName}</h2>
                            <p className="text-gray-500 text-sm">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                            <GiRank2 className="text-yellow-400 text-2xl mx-auto mb-1" />
                            <p className="text-yellow-400 font-bold text-sm">{user?.rank}</p>
                            <p className="text-gray-600 text-xs">RANK</p>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                            <MdSportsScore className="text-green-400 text-2xl mx-auto mb-1" />
                            <p className="text-green-400 font-bold text-sm">{user?.totalScore}</p>
                            <p className="text-gray-600 text-xs">TOTAL SCORE</p>
                        </div>
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 text-center">
                            <MdGamepad className="text-blue-400 text-2xl mx-auto mb-1" />
                            <p className="text-blue-400 font-bold text-sm">{user?.gamesPlayed}</p>
                            <p className="text-gray-600 text-xs">MISSIONS</p>
                        </div>
                    </div>
                </div>

                
                {highestScore && (
                    <div className="bg-gray-900 border border-yellow-800 rounded-xl p-4 mb-4 shadow-2xl">
                        <h3 className="text-white font-bold mb-3 tracking-widest flex items-center gap-2">
                            <MdEmojiEvents className="text-yellow-400" />
                            HIGHEST <span className="text-yellow-400 ml-1">SCORE</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
                                <p className="text-yellow-400 font-bold text-sm">{highestScore.score}</p>
                                <p className="text-gray-600 text-xs">SCORE</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
                                <p className="text-green-400 font-bold text-sm">{highestScore.wiresDefused}</p>
                                <p className="text-gray-600 text-xs">WIRES</p>
                            </div>
                            <div className="bg-gray-800 border border-gray-700 rounded-lg p-2">
                                <p className="text-blue-400 font-bold text-sm">{highestScore.difficulty?.toUpperCase()}</p>
                                <p className="text-gray-600 text-xs">DIFFICULTY</p>
                            </div>
                        </div>
                    </div>
                )}

                
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 shadow-2xl">
                    <h3 className="text-white font-bold mb-3 tracking-widest">
                        RECENT <span className="text-green-400">MISSIONS</span>
                    </h3>
                    {recentGames.length === 0 ? (
                        <p className="text-gray-600 text-sm text-center py-4">No missions completed yet</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {recentGames.map((game, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm">
                                    <span className={game.status === 'won' ? 'text-green-400 flex items-center gap-1' : 'text-red-400 flex items-center gap-1'}>
                                        {game.status === 'won'
                                            ? <><MdCheckCircle /> DEFUSED</>
                                            : <><MdDangerous /> EXPLODED</>
                                        }
                                    </span>
                                    <span className="text-gray-500">Score: {game.score}</span>
                                    <span className="text-gray-600">{game.difficulty}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileScreen;