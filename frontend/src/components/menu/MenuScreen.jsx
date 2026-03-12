
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
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 border border-green-500 rounded-lg p-8">

                
                <div className="text-center mb-8">
                    <GiTimeBomb className="text-green-400 text-6xl mx-auto mb-2" />
                    <h1 className="text-4xl font-bold text-green-400 mb-1">CODE DEFUSE</h1>
                    <p className="text-gray-400 text-sm">MISSION CONTROL</p>
                </div>

                
                <div className="bg-gray-700 border border-green-700 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <GiRank2 className="text-green-400 text-xl" />
                        <span className="text-green-400 font-bold text-lg">{user?.agentName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Rank: <span className="text-yellow-400">{user?.rank}</span></span>
                        <span className="text-gray-400">Score: <span className="text-green-400">{user?.totalScore}</span></span>
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