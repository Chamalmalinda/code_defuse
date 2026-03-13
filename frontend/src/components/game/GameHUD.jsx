import { useGame } from '../../context/GameContext';
import { formatTime } from '../../utils/helpers';
import { MdTimer, MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { GiWireCoil } from 'react-icons/gi';

const GameHUD = ({ agentName, difficulty }) => {
    const { timeLeft, wiresCut, score, lives } = useGame();

    const totalWires = difficulty === 'easy' ? 3 : difficulty === 'hard' ? 7 : 5;
    const timerColor = timeLeft > 30 ? 'text-green-400' : timeLeft > 10 ? 'text-yellow-400' : 'text-red-400 animate-pulse';

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-3">
            <div className="grid grid-cols-4 gap-2 text-center">

               
                <div className="flex flex-col items-center">
                    <MdTimer className={`text-2xl ${timerColor}`}
                        style={{ filter: timeLeft <= 10 ? 'drop-shadow(0 0 1px #f87171)' : timeLeft <= 30 ? 'drop-shadow(0 0 6px #facc15)' : 'drop-shadow(0 0 6px #4ade80)' }}
                    />
                    <span className={`font-bold text-lg ${timerColor}`}>{formatTime(timeLeft)}</span>
                    <span className="text-gray-600 text-xs">TIME</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                            i < lives
                                ? <MdFavorite key={i} className="text-red-400 text-xl"
                                    style={{ filter: 'drop-shadow(0 0 1px #f87171)' }} />
                                : <MdFavoriteBorder key={i} className="text-gray-600 text-xl" />
                        ))}
                    </div>
                    <span className="text-red-400 font-bold text-lg">{lives}</span>
                    <span className="text-gray-600 text-xs">LIVES</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <GiWireCoil className="text-yellow-400 text-2xl"
                        style={{ filter: 'drop-shadow(0 0 2px #facc15)' }}
                    />
                    <span className="text-yellow-400 font-bold text-lg">{wiresCut}/{totalWires}</span>
                    <span className="text-gray-600 text-xs">WIRES</span>
                </div>

                
                <div className="flex flex-col items-center">
                    <span className="text-green-400 text-2xl font-bold"
                        style={{ filter: 'drop-shadow(0 0 1px #4ade80)' }}>★</span>
                    <span className="text-green-400 font-bold text-lg">{score}</span>
                    <span className="text-gray-600 text-xs">SCORE</span>
                </div>
            </div>

            
            <div className="text-center mt-2 border-t border-gray-800 pt-2">
                <span className="text-gray-500 text-xs">AGENT: </span>
                <span className="text-green-400 text-xs font-bold">{agentName}</span>
                <span className="text-gray-600 text-xs ml-2">| {difficulty?.toUpperCase()}</span>
            </div>
        </div>
    );
};

export default GameHUD;