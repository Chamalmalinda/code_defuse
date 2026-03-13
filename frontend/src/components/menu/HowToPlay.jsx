
import { useNavigate } from 'react-router-dom';
import { GiTimeBomb, GiElectric } from 'react-icons/gi';
import { MdArrowBack, MdTimer, MdCheckCircle, MdDangerous, MdFavorite } from 'react-icons/md';
import Button from '../common/Button';

const HowToPlay = () => {
    const navigate = useNavigate();

    const steps = [
        {
            icon: <GiTimeBomb className="text-green-400 text-3xl" />,
            title: 'MISSION BRIEFING',
            desc: 'A bomb has been activated. You must defuse it before the timer hits zero.'
        },
        {
            icon: <GiElectric className="text-yellow-400 text-3xl" />,
            title: 'CUT THE WIRES',
            desc: 'Each wire is protected by an encrypted puzzle. Solve the puzzle to cut the wire.'
        },
        {
            icon: <MdTimer className="text-blue-400 text-3xl" />,
            title: 'BEAT THE CLOCK',
            desc: 'You have limited time. Correct answers add bonus time. Wrong answers cost you time.'
        },
        {
            icon: <MdFavorite className="text-red-400 text-3xl" />,
            title: 'LIVES SYSTEM',
            desc: 'You have 3 lives per mission. Each wrong answer costs a life. Lose all lives and the bomb explodes.'
        },
        {
            icon: <MdCheckCircle className="text-green-400 text-3xl" />,
            title: 'MISSION SUCCESS',
            desc: 'Cut all wires before time runs out to defuse the bomb and save the day.'
        },
        {
            icon: <MdDangerous className="text-red-400 text-3xl" />,
            title: 'MISSION FAILED',
            desc: 'If the timer hits zero or you lose all 3 lives, the bomb explodes.'
        },
    ];

    const difficulties = [
        { level: 'EASY',   time: '90s', wires: 3, lives: 3, penalty: '-5s',  bonus: '+5s',  color: 'text-green-400'  },
        { level: 'NORMAL', time: '60s', wires: 5, lives: 3, penalty: '-10s', bonus: '+8s',  color: 'text-yellow-400' },
        { level: 'HARD',   time: '30s', wires: 7, lives: 3, penalty: '-15s', bonus: '+10s', color: 'text-red-400'    },
    ];

    return (
        <div className="min-h-screen bg-gray-900 p-4">
            <div className="max-w-md mx-auto">

                
                <div className="flex items-center gap-3 mb-6">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-green-400">HOW TO PLAY</h1>
                </div>

                
                <div className="flex flex-col gap-3 mb-6">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-800 border border-green-700 rounded-lg p-4 flex items-start gap-4">
                            <div className="mt-1">{step.icon}</div>
                            <div>
                                <h3 className="text-green-400 font-bold text-sm mb-1">{step.title}</h3>
                                <p className="text-gray-400 text-sm">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div className="bg-gray-800 border border-green-700 rounded-lg p-4 mb-6">
                    <h3 className="text-green-400 font-bold mb-3 flex items-center gap-2">
                        <GiTimeBomb /> DIFFICULTY LEVELS
                    </h3>
                    <div className="grid grid-cols-5 gap-2 text-xs text-gray-500 mb-2 px-1">
                        <span>LEVEL</span>
                        <span>TIME</span>
                        <span>WIRES</span>
                        <span>LIVES</span>
                        <span>±TIME</span>
                    </div>
                    {difficulties.map((diff, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 text-sm bg-gray-700 rounded p-2 mb-2">
                            <span className={`font-bold ${diff.color}`}>{diff.level}</span>
                            <span className="text-gray-300">{diff.time}</span>
                            <span className="text-gray-300">{diff.wires}</span>
                            <span className="text-gray-300">{diff.lives}</span>
                            <span className="text-gray-300 text-xs">{diff.penalty}/{diff.bonus}</span>
                        </div>
                    ))}
                </div>

                
                <Button
                    onClick={() => navigate('/game')}
                    className="w-full flex items-center justify-center gap-2"
                >
                    <GiTimeBomb className="text-xl" />
                    START MISSION
                </Button>
            </div>
        </div>
    );
};

export default HowToPlay;