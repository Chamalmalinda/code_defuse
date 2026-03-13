
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { GiTimeBomb } from 'react-icons/gi';
import { MdArrowBack, MdCheckCircle, MdDangerous } from 'react-icons/md';
import { DIFFICULTY } from '../../utils/constants';
import GameHUD from './GameHUD';
import BombDisplay from './BombDisplay';
import PuzzleDisplay from './PuzzleDisplay';
import Button from '../common/Button';
import Loading from '../common/Loading';

const GameScreen = () => {
    const { user }                                                   = useAuth();
    const { gameStatus, startGame, resetGame, wiresCut, score, loading, lives } = useGame();
    const navigate                                                   = useNavigate();
    const [selectedDiff, setSelectedDiff]                           = useState('normal');
    const [phase, setPhase]                                          = useState('select');
    const [showAbort, setShowAbort]                                  = useState(false);

    const totalWires = DIFFICULTY[selectedDiff]?.wires || 5;

    const handleStart = async () => {
        setPhase('playing');
        await startGame(selectedDiff);
    };

    useEffect(() => {
        if (gameStatus === 'won' || gameStatus === 'exploded') {
            setPhase('over');
            setShowAbort(false);
        }
    }, [gameStatus]);

    const handlePlayAgain = () => {
        resetGame();
        setPhase('select');
    };

    const handleAbort = () => {
        resetGame();
        navigate('/menu');
    };


    if (phase === 'select') return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 border border-green-500 rounded-lg p-8">

                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-green-400">SELECT DIFFICULTY</h1>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                    {Object.entries(DIFFICULTY).map(([key, val]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedDiff(key)}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-200
                                        ${selectedDiff === key
                                            ? 'border-green-400 bg-gray-700'
                                            : 'border-gray-600 bg-gray-800 hover:border-gray-400'}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className={`font-bold text-lg ${
                                    key === 'easy'   ? 'text-green-400' :
                                    key === 'normal' ? 'text-yellow-400' : 'text-red-400'
                                }`}>{val.label.toUpperCase()}</span>
                                <span className="text-gray-400 text-sm">{val.time}s</span>
                            </div>
                            <div className="flex gap-4 mt-1 text-xs text-gray-500">
                                <span>Wires: {val.wires}</span>
                                <span>Lives: {val.lives}</span>
                                <span>Penalty: -{val.wrongPenalty}s</span>
                                <span>Bonus: +{val.correctBonus}s</span>
                            </div>
                        </button>
                    ))}
                </div>

                <Button onClick={handleStart} className="w-full flex items-center justify-center gap-2">
                    <GiTimeBomb className="text-xl" /> BEGIN MISSION
                </Button>
            </div>
        </div>
    );


    if (phase === 'over') return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 border rounded-lg p-8 text-center"
                 style={{ borderColor: gameStatus === 'won' ? '#22c55e' : '#ef4444' }}>

                {gameStatus === 'won' ? (
                    <>
                        <MdCheckCircle className="text-green-400 text-7xl mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-green-400 mb-2">BOMB DEFUSED!</h2>
                        <p className="text-gray-400 mb-4">Mission Complete, Agent {user?.agentName}</p>
                    </>
                ) : (
                    <>
                        <MdDangerous className="text-red-400 text-7xl mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-red-400 mb-2">BOOM!</h2>
                        <p className="text-gray-400 mb-4">Mission Failed, Agent {user?.agentName}</p>
                    </>
                )}

                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Wires Defused:</span>
                        <span className="text-green-400 font-bold">{wiresCut}/{totalWires}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Lives Remaining:</span>
                        <span className="text-red-400 font-bold">{lives}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Final Score:</span>
                        <span className="text-green-400 font-bold">{score}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button onClick={handlePlayAgain} className="w-full">
                        PLAY AGAIN
                    </Button>
                    <Button onClick={() => navigate('/menu')} variant="outline" className="w-full">
                        BACK TO MENU
                    </Button>
                </div>
            </div>
        </div>
    );


    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <Loading message="Initializing mission..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 p-3">
            <div className="max-w-md mx-auto">


                <div className="flex justify-end mb-2">
                    {!showAbort ? (
                        <Button
                            variant="secondary"
                            onClick={() => setShowAbort(true)}
                            className="text-xs"
                        >
                            <MdArrowBack className="text-sm" /> ABORT
                        </Button>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <span className="text-red-400 text-xs">Abort mission?</span>
                            <Button variant="danger" onClick={handleAbort} className="text-xs">
                                YES
                            </Button>
                            <Button variant="secondary" onClick={() => setShowAbort(false)} className="text-xs">
                                NO
                            </Button>
                        </div>
                    )}
                </div>

                <GameHUD agentName={user?.agentName} difficulty={selectedDiff} />
                <BombDisplay wiresCut={wiresCut} totalWires={totalWires} />
                <PuzzleDisplay />
            </div>
        </div>
    );
};

export default GameScreen;