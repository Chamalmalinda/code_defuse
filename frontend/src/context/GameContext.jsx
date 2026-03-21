
import { createContext, useContext, useState, useRef, useCallback } from 'react';
import { fetchPuzzle } from '../services/puzzleService';
import { saveScore, saveDailyScore } from '../services/gameService';
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
    const isDailyRef                  = useRef(false);
    const gameStatusRef               = useRef('idle'); 


    const updateWiresCut = (val) => { wiresCutRef.current = val; setWiresCut(val); };
    const updateTimeLeft = (val) => { timeLeftRef.current = val; setTimeLeft(val); };
    const updateLives    = (val) => { livesRef.current = val; setLives(val); };


    const updateGameStatus = (status) => {
        gameStatusRef.current = status;
        setGameStatus(status);
    };


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
        intervalRef.current = setInterval(async () => {
            setTimeLeft(prev => {
                const next = prev - 1;
                timeLeftRef.current = next;


                if (next <= 10 && next > 0) playTick();

                if (next <= 0) {
                    clearInterval(intervalRef.current);


                    if (gameStatusRef.current === 'exploded') return 0;

                   
                    updateGameStatus('exploded');
                    playExplosion();

                    
                    const finalScore = calculateScore(
                        wiresCutRef.current,
                        0,
                        difficultyRef.current
                    );
                    setScore(finalScore);
                    const saveFn = isDailyRef.current ? saveDailyScore : saveScore;
                    saveFn({
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

  
    const adjustTime = useCallback((seconds) => {
        setTimeLeft(prev => {
            const next = Math.max(0, prev + seconds);
            timeLeftRef.current = next;
            return next;
        });
    }, []);

    
    const startGame = useCallback(async (selectedDifficulty = 'normal', isDaily = false) => {
        const diff = getDifficulty(selectedDifficulty);
        difficultyRef.current = selectedDifficulty;
        isDailyRef.current    = isDaily;
        setDifficulty(selectedDifficulty);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(diff.time);
        updateLives(diff.lives);
        updateGameStatus('playing');
        await loadPuzzle();
        startTimer();
    }, [loadPuzzle, startTimer]);

    
    const handleCorrectAnswer = useCallback(async () => {
        const diff        = getDifficulty(difficultyRef.current);
        const newWiresCut = wiresCutRef.current + 1;
        const totalWires  = diff.wires;

       
        playCorrect();
        adjustTime(diff.correctBonus);
        updateWiresCut(newWiresCut);

           
       const currentScore = calculateScore(newWiresCut, timeLeftRef.current, difficultyRef.current);
       setScore(currentScore);


        if (newWiresCut >= totalWires) {
            
            stopTimer();
            playVictory();
            const finalScore = calculateScore(newWiresCut, timeLeftRef.current, difficultyRef.current);
            setScore(finalScore);
            updateGameStatus('won');

            
            try {
                const saveFn = isDailyRef.current ? saveDailyScore : saveScore;
                const result = await saveFn({
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

   
    const handleWrongAnswer = useCallback(async () => {
        const diff     = getDifficulty(difficultyRef.current);
        const newLives = livesRef.current - 1;

       
        playWrong();

        
        adjustTime(-diff.wrongPenalty);

       
        updateLives(newLives);

  
        if (newLives <= 0) {
            stopTimer();
            updateGameStatus('exploded'); 
            playExplosion();

            
            try {
                const finalScore = calculateScore(
                    wiresCutRef.current,
                    timeLeftRef.current,
                    difficultyRef.current
                );
                setScore(finalScore);
                const saveFn = isDailyRef.current ? saveDailyScore : saveScore;
                const result = await saveFn({
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

    
    const resetGame = useCallback(() => {
        stopTimer();
        setPuzzle(null);
        updateWiresCut(0);
        setScore(0);
        updateTimeLeft(60);
        updateLives(3);
        isDailyRef.current = false;
        updateGameStatus('idle');
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