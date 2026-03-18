import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GiTimeBomb, GiRank2 } from 'react-icons/gi';
import { MdLeaderboard, MdLogout, MdPlayArrow, MdPerson, MdHelp } from 'react-icons/md';
import Button from '../common/Button';

const MenuScreen = () => {
    const { user, logout } = useAuth();
    const navigate         = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                
                <div className="text-center mb-6">
                    <GiTimeBomb
                        className="text-green-400 text-7xl mx-auto mb-3 animate-glow"
                        style={{ filter: 'drop-shadow(0 0 10px #4ade80)' }}
                    />
                    <h1 className="text-4xl font-bold text-white mb-1 tracking-widest">
                        CODE <span className="text-green-400">DEFUSE</span>
                    </h1>
                    <p className="text-gray-500 text-xs tracking-[0.25em] uppercase">MISSION CONTROL</p>
                </div>

                
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <GiRank2 className="text-green-400 text-xl" />
                        <span className="text-white font-bold text-lg tracking-wide">{user?.agentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rank: <span className="text-yellow-400">{user?.rank}</span></span>
                        <span className="text-gray-500">Score: <span className="text-green-400">{user?.totalScore}</span></span>
                    </div>
                </div>

                
                <div className="flex flex-col gap-3">
                    <Button
                        onClick={() => navigate('/game')}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <MdPlayArrow className="text-xl" />
                        START MISSION
                    </Button>

                    <Button
                        onClick={() => navigate('/profile')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <MdPerson className="text-xl" />
                        AGENT PROFILE
                    </Button>

                    <Button
                        onClick={() => navigate('/how-to-play')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <MdHelp className="text-xl" />
                        HOW TO PLAY
                    </Button>

                    <Button
                        onClick={() => navigate('/leaderboard')}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <MdLeaderboard className="text-xl" />
                        LEADERBOARD
                    </Button>

                    <Button
                        onClick={handleLogout}
                        variant="secondary"
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <MdLogout className="text-xl" />
                        LOGOUT
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default MenuScreen;