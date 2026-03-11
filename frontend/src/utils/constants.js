

export const TOTAL_WIRES = 5;
export const TIMER_START = 60;
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const RANKS = [
    { name: 'Recruit',     minScore: 0    },
    { name: 'Bronze',      minScore: 500  },
    { name: 'Silver',      minScore: 1500 },
    { name: 'Gold',        minScore: 3000 },
    { name: 'Elite Agent', minScore: 5000 },
];

export const DIFFICULTY = {
    easy:   { time: 90,  label: 'Easy',   wrongPenalty: 5,  correctBonus: 5,  wires: 3 },
    normal: { time: 60,  label: 'Normal', wrongPenalty: 10, correctBonus: 8,  wires: 5 },
    hard:   { time: 30,  label: 'Hard',   wrongPenalty: 15, correctBonus: 10, wires: 7 },
};

