// Game Context - manages global game state including timer, puzzle, lives and sounds
// Event-driven core - timer ticks, puzzle fetch, wire cut, lives events managed here
// Reference: React Context docs - https://react.dev/reference/react/createContext
// Reference: Web Audio API - https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { fetchPuzzle } from '../services/puzzleService';
import { saveScore } from '../services/gameService';
import { calculateScore, getDifficulty } from '../utils/helpers';
import { useAuth } from './AuthContext';
import { playCorrect, playWrong, playExplosion, playVictory, playTick } from '../utils/soundEffects';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const { user, updateUser }        = useAuth();
    const [puzzle, setPuzzle]         = useState(null);
    const [wiresCut, setWiresCut]     = useState(0);
    const [timeLeft, setTimeLeft]     = useState(60);
    const [lives, setLives]           = useState(3);
    const [gameStatus, setGameStatus] = useState('idle');
    const [loading, setLoading]       = useState(false);
    const [difficulty, setDifficulty] = useState('normal');
    const [score, setScore]           = useState(0);
    const intervalRef                 = useRef(null);
    const wiresCutRef                 = useRef(0);
    const timeLeftRef                 = useRef(60);
    const livesRef                    = useRef(3);
    const difficultyRef               = useRef('normal');

    // Keep refs in sync with state — needed for setInterval closure
    const updateWiresCut = (val) => { wiresCutRef.current = val; setWiresCut(val); };
    const updateTimeLeft = (val) => { timeLeftRef.current = val; setTimeLeft(val); };
    const updateLives    = (val) => { livesRef.current = val; setLives(val); };

    // Load puzzle from Banana API — Interoperability event
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

    // Start timer — setInterval fires tick event every second
    // This is the core event-driven mechanism of the game
    const startTimer = useCallback(() => {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(async () => {
            setTimeLeft(prev => {
                const next = prev - 1;
                timeLeftRef.current = next;

                // Last 10 seconds — play tick sound event
                if (next <= 10 && next > 0) playTick();

                if (next <= 0) {
                    // Timer = 0 → explosion event
                    clearInterval(intervalRef.current);
                    setGameStatus('exploded');
                    playExplosion();

                    // Save score on timer expiry
                    const finalScore = calculateScore(
                        wiresCutRef.current,
                        0,
                        difficultyRef.current
                    );
                    setScore(finalScore);
                    saveScore({
                        score:         finalScore,
                        wiresDefused:  wiresCutRef.current,
                        timeRemaining: 0,
                        status:        'exploded',
                        difficulty:    difficultyRef.current
                    }).then(result => {
                        updateUser({ ...user, totalScore: result.totalScore, rank: result.rank });
                    }).catch(err => console.error('Score save failed:', err));

                    return 0;
                }
                return next;
            });
        }, 1000);
    }, [updateUser, user]);

    const stopTimer = useCallback(() => {
        clearInterval(intervalRef.current);
    }, []);

    // Adjust time — add or deduct seconds based on answer event
    const adjustTime = useCallback((seconds) => {
        setTimeLeft(prev => {
            const next = Math.max(0, prev + seconds);
            timeLeftRef.current = next;
            return next;
        });
    }, []);

    // Start new game — initialize all state and begin timer
    const startGame = useCallback(async (selectedDifficulty = 'normal') => {
        const diff = getDifficulty(selectedDifficulty);
        difficultyRef.current = selectedDifficulty;
        setDifficulty(selectedDifficulty);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(diff.time);
        updateLives(diff.lives);
        setGameStatus('playing');
        await loadPuzzle();
        startTimer();
    }, [loadPuzzle, startTimer]);

    // Handle correct answer — wire cut event + bonus time + sound
    const handleCorrectAnswer = useCallback(async () => {
        const diff        = getDifficulty(difficultyRef.current);
        const newWiresCut = wiresCutRef.current + 1;
        const totalWires  = diff.wires;

        // Play correct sound event
        playCorrect();
        adjustTime(diff.correctBonus);
        updateWiresCut(newWiresCut);

        if (newWiresCut >= totalWires) {
            // All wires cut — mission complete event
            stopTimer();
            playVictory();
            const finalScore = calculateScore(newWiresCut, timeLeftRef.current, difficultyRef.current);
            setScore(finalScore);
            setGameStatus('won');

            // Save score to MongoDB
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
            // Load next puzzle — interoperability event
            await loadPuzzle();
        }
    }, [adjustTime, stopTimer, loadPuzzle, updateUser, user]);

    // Handle wrong answer — penalty event + life lose + sound
    const handleWrongAnswer = useCallback(async () => {
        const diff     = getDifficulty(difficultyRef.current);
        const newLives = livesRef.current - 1;

        // Play wrong sound event
        playWrong();

        // Deduct time penalty
        adjustTime(-diff.wrongPenalty);

        // Lose a life
        updateLives(newLives);

        // Lives 0 → explosion event
        if (newLives <= 0) {
            stopTimer();
            setGameStatus('exploded');
            playExplosion();

            // Save score on lives depleted
            try {
                const finalScore = calculateScore(
                    wiresCutRef.current,
                    timeLeftRef.current,
                    difficultyRef.current
                );
                setScore(finalScore);
                const result = await saveScore({
                    score:         finalScore,
                    wiresDefused:  wiresCutRef.current,
                    timeRemaining: timeLeftRef.current,
                    status:        'exploded',
                    difficulty:    difficultyRef.current
                });
                updateUser({ ...user, totalScore: result.totalScore, rank: result.rank });
            } catch (error) {
                console.error('Score save failed:', error);
            }
        }
    }, [adjustTime, stopTimer, updateUser, user]);

    // Reset game — abort mission or play again
    const resetGame = useCallback(() => {
        stopTimer();
        setPuzzle(null);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(60);
        updateLives(3);
        setGameStatus('idle');
    }, [stopTimer]);

    return (
        <GameContext.Provider value={{
            puzzle, wiresCut, timeLeft, lives, gameStatus,
            loading, difficulty, score,
            startGame, resetGame,
            handleCorrectAnswer, handleWrongAnswer
        }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => useContext(GameContext);