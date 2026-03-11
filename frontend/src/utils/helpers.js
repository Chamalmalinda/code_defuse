

import { RANKS, DIFFICULTY } from './constants';


export const calculateRank = (totalScore) => {
    let currentRank = RANKS[0].name;
    for (const rank of RANKS) {
        if (totalScore >= rank.minScore) currentRank = rank.name;
    }
    return currentRank;
};


export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};


export const calculateScore = (wiresDefused, timeRemaining, difficulty) => {
    const base        = wiresDefused * 100;
    const timeBonus   = timeRemaining * 10;
    const multiplier  = difficulty === 'hard' ? 2 : difficulty === 'easy' ? 0.5 : 1;
    return Math.floor((base + timeBonus) * multiplier);
};


export const getDifficulty = (level) => {
    return DIFFICULTY[level] || DIFFICULTY.normal;
};