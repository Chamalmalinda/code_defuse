
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { fetchPuzzle } from '../services/puzzleService';
import { saveScore } from '../services/gameService';
import { calculateScore, getDifficulty } from '../utils/helpers';
import { useAuth } from './AuthContext';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { user, updateUser }        = useAuth();
    const [puzzle, setPuzzle]         = useState(null);
    const [wiresCut, setWiresCut]     = useState(0);
    const [timeLeft, setTimeLeft]     = useState(60);
    const [gameStatus, setGameStatus] = useState('idle');
    const [loading, setLoading]       = useState(false);
    const [difficulty, setDifficulty] = useState('normal');
    const [score, setScore]           = useState(0);
    const intervalRef                 = useRef(null);
    const wiresCutRef                 = useRef(0);
    const timeLeftRef                 = useRef(60);
    const difficultyRef               = useRef('normal');

   
    const updateWiresCut = (val) => { wiresCutRef.current = val; setWiresCut(val); };
    const updateTimeLeft = (val) => { timeLeftRef.current = val; setTimeLeft(val); };


    const loadPuzzle = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchPuzzle();
            setPuzzle(data);
        } catch (error) {
            console.error('Puzzle fetch failed:', error);
        }
        setLoading(false);
    }, []);


    const startTimer = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const next = prev - 1;
                timeLeftRef.current = next;
                if (next <= 0) {
                    clearInterval(intervalRef.current);
                    setGameStatus('exploded');
                    return 0;
                }
                return next;
            });
        }, 1000);
    }, []);

    const stopTimer = useCallback(() => {
        clearInterval(intervalRef.current);
    }, []);


    const adjustTime = useCallback((seconds) => {
        setTimeLeft(prev => {
            const next = Math.max(0, prev + seconds);
            timeLeftRef.current = next;
            return next;
        });
    }, []);


    const startGame = useCallback(async (selectedDifficulty = 'normal') => {
        const diff = getDifficulty(selectedDifficulty);
        difficultyRef.current = selectedDifficulty;
        setDifficulty(selectedDifficulty);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(diff.time);
        setGameStatus('playing');
        await loadPuzzle();
        startTimer();
    }, [loadPuzzle, startTimer]);

  
    const handleCorrectAnswer = useCallback(async () => {
        const diff        = getDifficulty(difficultyRef.current);
        const newWiresCut = wiresCutRef.current + 1;
        const totalWires  = diff.wires;

        adjustTime(diff.correctBonus);
        updateWiresCut(newWiresCut);

        if (newWiresCut >= totalWires) {
            stopTimer();
            const finalScore = calculateScore(newWiresCut, timeLeftRef.current, difficultyRef.current);
            setScore(finalScore);
            setGameStatus('won');


            try {
                const result = await saveScore({
                    score:         finalScore,
                    wiresDefused:  newWiresCut,
                    timeRemaining: timeLeftRef.current,
                    status:        'won',
                    difficulty:    difficultyRef.current
                });

                updateUser({ ...user, totalScore: result.totalScore, rank: result.rank });
            } catch (error) {
                console.error('Score save failed:', error);
            }
        } else {
            await loadPuzzle();
        }
    }, [adjustTime, stopTimer, loadPuzzle, updateUser, user]);


    const handleWrongAnswer = useCallback(() => {
        const diff = getDifficulty(difficultyRef.current);
        adjustTime(-diff.wrongPenalty);
    }, [adjustTime]);


    const resetGame = useCallback(() => {
        stopTimer();
        setPuzzle(null);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(60);
        setGameStatus('idle');
    }, [stopTimer]);

    return (
        <GameContext.Provider value={{
            puzzle, wiresCut, timeLeft, gameStatus,
            loading, difficulty, score,
            startGame, resetGame,
            handleCorrectAnswer, handleWrongAnswer
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);