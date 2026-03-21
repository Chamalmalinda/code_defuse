import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameContext';
import { checkDailyChallenge } from '../../services/gameService';
import { GiTimeBomb } from 'react-icons/gi';
import { MdArrowBack, MdTimer, MdCheckCircle, MdLock } from 'react-icons/md';
import Button from '../common/Button';
import Loading from '../common/Loading';
import GameHUD from '../game/GameHUD';
import BombDisplay from '../game/BombDisplay';
import PuzzleDisplay from '../game/PuzzleDisplay';
import { DIFFICULTY } from '../../utils/constants';

const DAILY_DIFFICULTY = 'normal'; 

const DailyChallenge = () => {
    const { user }                          = useAuth();
    const { gameStatus, startGame, resetGame, wiresCut, score, loading } = useGame();
    const navigate                          = useNavigate();
    const [phase, setPhase]                 = useState('check');
    const [alreadyPlayed, setAlreadyPlayed] = useState(false);
    const [checking, setChecking]           = useState(true);
    const [prevSession, setPrevSession]     = useState(null);

    const totalWires = DIFFICULTY[DAILY_DIFFICULTY]?.wires || 5;


    useEffect(() => {
        const check = async () => {
            try {
                const data = await checkDailyChallenge();
                if (data.played) {
                    setAlreadyPlayed(true);
                    setPrevSession(data.session);
                    setPhase('completed');
                } else {
                    setPhase('ready');
                }
            } catch (error) {
                console.error('Daily check failed:', error);
                setPhase('ready');
            } finally {
                setChecking(false);
            }
        };
        check();
    }, []);

  
    useEffect(() => {
        if (gameStatus === 'won' || gameStatus === 'exploded') {
            setPhase('over');
        }
    }, [gameStatus]);

    const handleStart = async () => {
        setPhase('playing');
        await startGame(DAILY_DIFFICULTY, true);
    };

    const handleFinish = () => {
        resetGame();
        navigate('/menu');
    };


    if (checking) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loading message="Checking daily mission status..." />
        </div>
    );


    if (phase === 'completed') return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-center shadow-2xl">
                <MdLock className="text-yellow-400 text-7xl mx-auto mb-4"
                    style={{ filter: 'drop-shadow(0 0 8px #facc15)' }} />
                <h2 className="text-2xl font-bold text-white mb-2 tracking-widest">
                    MISSION <span className="text-yellow-400">COMPLETE</span>
                </h2>
                <p className="text-gray-500 text-xs tracking-wide mb-6">
                    You have already completed today's daily challenge. Come back tomorrow!
                </p>


                {prevSession && (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                        <h3 className="text-white font-bold text-xs mb-3 tracking-widest">
                            TODAY'S <span className="text-green-400">RESULT</span>
                        </h3>
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
                                <p className="text-green-400 font-bold text-sm">{prevSession.score}</p>
                                <p className="text-gray-600 text-xs">SCORE</p>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
                                <p className="text-yellow-400 font-bold text-sm">{prevSession.wiresDefused}</p>
                                <p className="text-gray-600 text-xs">WIRES</p>
                            </div>
                            <div className="bg-gray-900 border border-gray-700 rounded-lg p-2">
                                <p className={`font-bold text-sm ${prevSession.status === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                                    {prevSession.status === 'won' ? 'WON' : 'FAILED'}
                                </p>
                                <p className="text-gray-600 text-xs">STATUS</p>
                            </div>
                        </div>
                    </div>
                )}


                <p className="text-gray-600 text-xs mb-6">
                    Next challenge available at midnight
                </p>

                <Button onClick={() => navigate('/menu')} className="w-full flex items-center justify-center gap-2">
                    <MdArrowBack className="text-xl" /> BACK TO MENU
                </Button>
            </div>
        </div>
    );


    if (phase === 'ready') return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 shadow-2xl">

                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white tracking-widest">
                        DAILY <span className="text-yellow-400">CHALLENGE</span>
                    </h1>
                </div>

                <div className="text-center mb-6">
                    <GiTimeBomb
                        className="text-yellow-400 text-7xl mx-auto mb-3"
                        style={{ filter: 'drop-shadow(0 0 10px #facc15)' }}
                    />
                    <p className="text-gray-500 text-xs tracking-wide mb-2">Today's special mission awaits!</p>
                    <p className="text-red-400 text-xs tracking-wide">⚠ You only get ONE attempt per day</p>
                </div>


                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                            <p className="text-yellow-400 font-bold text-sm">NORMAL</p>
                            <p className="text-gray-600 text-xs">DIFFICULTY</p>
                        </div>
                        <div>
                            <p className="text-yellow-400 font-bold text-sm">5</p>
                            <p className="text-gray-600 text-xs">WIRES</p>
                        </div>
                        <div>
                            <p className="text-yellow-400 font-bold text-sm">60s</p>
                            <p className="text-gray-600 text-xs">TIME</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleStart}
                    className="w-full flex items-center justify-center gap-2 py-3"
                    variant="danger"
                >
                    <GiTimeBomb className="text-xl" /> ACCEPT MISSION
                </Button>
            </div>
        </div>
    );


    if (phase === 'over') return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border rounded-xl p-8 text-center shadow-2xl"
                 style={{ borderColor: gameStatus === 'won' ? '#22c55e' : '#ef4444' }}>

                {gameStatus === 'won' ? (
                    <>
                        <MdCheckCircle className="text-green-400 text-7xl mx-auto mb-4"
                            style={{ filter: 'drop-shadow(0 0 8px #4ade80)' }} />
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-widest">
                            BOMB <span className="text-green-400">DEFUSED!</span>
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">Daily mission complete, Agent {user?.agentName}</p>
                    </>
                ) : (
                    <>
                        <GiTimeBomb className="text-red-400 text-7xl mx-auto mb-4"
                            style={{ filter: 'drop-shadow(0 0 8px #f87171)' }} />
                        <h2 className="text-3xl font-bold text-white mb-2 tracking-widest">
                            <span className="text-red-400">BOOM!</span>
                        </h2>
                        <p className="text-gray-500 text-sm mb-4">Daily mission failed, Agent {user?.agentName}</p>
                    </>
                )}

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Wires Defused:</span>
                        <span className="text-green-400 font-bold">{wiresCut}/{totalWires}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Final Score:</span>
                        <span className="text-green-400 font-bold">{score}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Next Challenge:</span>
                        <span className="text-yellow-400 font-bold">Tomorrow</span>
                    </div>
                </div>

                <Button onClick={handleFinish} className="w-full">
                    BACK TO MENU
                </Button>
            </div>
        </div>
    );


    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loading message="Initializing daily mission..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-950 p-3">
            <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-yellow-400 text-xs font-bold tracking-widest">
                        DAILY CHALLENGE
                    </span>
                    <MdTimer className="text-yellow-400"
                        style={{ filter: 'drop-shadow(0 0 5px #facc15)' }} />
                </div>
                <GameHUD agentName={user?.agentName} difficulty={DAILY_DIFFICULTY} />
                <BombDisplay wiresCut={wiresCut} totalWires={totalWires} />
                <PuzzleDisplay />
            </div>
        </div>
    );
};

export default DailyChallenge;