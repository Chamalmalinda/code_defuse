
import axios from 'axios';

const BANANA_API = import.meta.env.VITE_BANANA_API;


export const fetchPuzzle = async () => {
    try {
        const response = await axios.get(`${BANANA_API}?out=json`);
        return {
            imageUrl: response.data.question,
            answer:   response.data.solution  
        };
    } catch (error) {
        console.error('Banana API fetch failed:', error);
        throw new Error('Failed to fetch puzzle. Please try again.');
    }
};