
import { useGame } from '../../context/GameContext';
import { formatTime } from '../../utils/helpers';
import { MdTimer, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { GiWireCoil } from 'react-icons/gi';

const GameHUD = ({ agentName, difficulty }) => {
    const { timeLeft, wiresCut, score, lives } = useGame();

    const totalWires = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 7 : 5;
    const timerColor = timeLeft > 30 ? 'text-green-400' : timeLeft > 10 ? 'text-yellow-400' : 'text-red-400 animate-pulse';

    return (
        <div className="bg-gray-800 border border-green-700 rounded-lg p-3 mb-4">
            <div className="grid grid-cols-4 gap-2 text-center">

               
                <div className="flex flex-col items-center">
                    <MdTimer className={`text-2xl ${timerColor}`} />
                    <span className={`font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
                    <span className="text-gray-500 text-xs">TIME</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            i < lives
                                ? <MdFavorite key={i} className="text-red-400 text-xl" />
                                : <MdFavoriteBorder key={i} className="text-gray-600 text-xl" />
                        ))}
                    </div>
                    <span className="text-red-400 font-bold text-lg">{lives}</span>
                    <span className="text-gray-500 text-xs">LIVES</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <GiWireCoil className="text-yellow-400 text-2xl" />
                    <span className="text-yellow-400 font-bold text-lg">{wiresCut}/{totalWires}</span>
                    <span className="text-gray-500 text-xs">WIRES</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <span className="text-green-400 text-2xl font-bold">★</span>
                    <span className="text-green-400 font-bold text-lg">{score}</span>
                    <span className="text-gray-500 text-xs">SCORE</span>
                </div>
            </div>

            
            <div className="text-center mt-2 border-t border-gray-700 pt-2">
                <span className="text-gray-400 text-xs">AGENT: </span>
                <span className="text-green-400 text-xs font-bold">{agentName}</span>
                <span className="text-gray-600 text-xs ml-2">| {difficulty?.toUpperCase()}</span>
            </div>
        </div>
    );
};

export default GameHUD;