
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProfile } from '../../services/gameService';
import { GiRank2, GiTimeBomb } from 'react-icons/gi';
import { MdCheckCircle, MdDangerous } from 'react-icons/md';
import { MdArrowBack, MdSportsScore, MdGamepad } from 'react-icons/md';
import Loading from '../common/Loading';
import Button from '../common/Button';

const ProfileScreen = () => {
    const { user }                    = useAuth();
    const navigate                    = useNavigate();
    const [recentGames, setRecentGames] = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const data = await getProfile();
                setRecentGames(data.recentGames);
            } catch (error) {
                console.error('Profile load failed:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loading message="Loading agent profile..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-md mx-auto">

                
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-green-400">AGENT PROFILE</h1>
                </div>

                
                <div className="bg-gray-800 border border-green-500 rounded-lg p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <GiTimeBomb className="text-green-400 text-4xl" />
                        <div>
                            <h2 className="text-xl font-bold text-green-400">{user?.agentName}</h2>
                            <p className="text-gray-400 text-sm">{user?.email}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-gray-700 rounded-lg p-3 text-center">
                            <GiRank2 className="text-yellow-400 text-2xl mx-auto mb-1" />
                            <p className="text-yellow-400 font-bold text-sm">{user?.rank}</p>
                            <p className="text-gray-500 text-xs">RANK</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 text-center">
                            <MdSportsScore className="text-green-400 text-2xl mx-auto mb-1" />
                            <p className="text-green-400 font-bold text-sm">{user?.totalScore}</p>
                            <p className="text-gray-500 text-xs">TOTAL SCORE</p>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-3 text-center">
                            <MdGamepad className="text-blue-400 text-2xl mx-auto mb-1" />
                            <p className="text-blue-400 font-bold text-sm">{user?.gamesPlayed}</p>
                            <p className="text-gray-500 text-xs">MISSIONS</p>
                        </div>
                    </div>
                </div>

                
                <div className="bg-gray-800 border border-green-700 rounded-lg p-4">
                    <h3 className="text-green-400 font-bold mb-3">RECENT MISSIONS</h3>
                    {recentGames.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">No missions completed yet</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {recentGames.map((game, index) => (
                                <div key={index} className="flex justify-between items-center bg-gray-700 rounded p-3 text-sm">
                                    <span className={game.status === 'won' ? 'text-green-400 flex items-center gap-1' : 'text-red-400 flex items-center gap-1'}>
                                          {game.status === 'won' 
                                                ? <><MdCheckCircle /> DEFUSED</> 
                                                : <><MdDangerous /> EXPLODED</>
                                          }
                                   </span>
                                    <span className="text-gray-400">Score: {game.score}</span>
                                    <span className="text-gray-500">{game.difficulty}</span>
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