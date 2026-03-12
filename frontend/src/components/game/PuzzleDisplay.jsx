
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { MdSend, MdCheckCircle, MdDangerous } from 'react-icons/md';
import { GiWireCoil } from 'react-icons/gi';
import Loading from '../common/Loading';
import Button from '../common/Button';
import Input from '../common/Input';

const PuzzleDisplay = () => {
    const { puzzle, loading, handleCorrectAnswer, handleWrongAnswer } = useGame();
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState(null);

    const handleSubmit = async () => {
        if (!answer) return;

        if (parseInt(answer) === puzzle.answer) {
            setFeedback('correct');
            setAnswer('');
            setTimeout(() => setFeedback(null), 500);
            await handleCorrectAnswer();
        } else {
            setFeedback('wrong');
            setAnswer('');
            setTimeout(() => setFeedback(null), 500);
            handleWrongAnswer();
        }
    };

    if (loading) return (
        <div className="bg-gray-800 border border-green-700 rounded-lg p-4 flex items-center justify-center h-32">
            <Loading message="Fetching encrypted puzzle..." />
        </div>
    );

    return (
        <div className={`bg-gray-800 border rounded-lg p-3 transition-all duration-300
                        ${feedback === 'correct' ? 'border-green-400 shadow-lg shadow-green-900'
                        : feedback === 'wrong'   ? 'border-red-500 shadow-lg shadow-red-900'
                        :                          'border-green-700'}`}>

            
            <div className="flex items-center gap-2 mb-2">
                <GiWireCoil className="text-yellow-400 text-lg" />
                <h3 className="text-yellow-400 font-bold text-xs tracking-widest">ENCRYPTED WIRE CODE</h3>
            </div>

            
            {puzzle?.imageUrl && (
                <div className="mb-2 rounded overflow-hidden border border-gray-600 flex items-center justify-center bg-white"
                     style={{ maxHeight: '160px' }}>
                    <img
                        src={puzzle.imageUrl}
                        alt="Encrypted puzzle"
                        className="object-contain w-full"
                        style={{ maxHeight: '160px' }}
                    />
                </div>
            )}

            
            {feedback === 'correct' && (
                <div className="flex items-center justify-center gap-1 text-green-400 text-xs mb-2 font-bold">
                    <MdCheckCircle /> WIRE CUT! +BONUS TIME
                </div>
            )}
            {feedback === 'wrong' && (
                <div className="flex items-center justify-center gap-1 text-red-400 text-xs mb-2 font-bold">
                    <MdDangerous /> WRONG CODE! TIME PENALTY
                </div>
            )}

            
            <div className="flex gap-2">
                <Input
                    type="number"
                    placeholder="Enter wire code..."
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    className="flex-1"
                />
                <Button
                    onClick={handleSubmit}
                    variant="danger"
                    className="flex items-center gap-1"
                >
                    <MdSend /> CUT
                </Button>
            </div>
        </div>
    );
};

export default PuzzleDisplay;