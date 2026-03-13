
import { useNavigate } from 'react-router-dom';
import { GiTimeBomb, GiElectric } from 'react-icons/gi';
import { MdArrowBack, MdTimer, MdCheckCircle, MdDangerous, MdFavorite } from 'react-icons/md';
import Button from '../common/Button';

const HowToPlay = () => {
    const navigate = useNavigate();

    const steps = [
        {
            icon: <GiTimeBomb className="text-green-400 text-2xl" />,
            title: 'MISSION BRIEFING',
            desc: 'A bomb has been activated. You must defuse it before the timer hits zero.'
        },
        {
            icon: <GiElectric className="text-yellow-400 text-2xl" />,
            title: 'CUT THE WIRES',
            desc: 'Each wire is protected by an encrypted puzzle. Solve the puzzle to cut the wire.'
        },
        {
            icon: <MdTimer className="text-blue-400 text-2xl" />,
            title: 'BEAT THE CLOCK',
            desc: 'You have limited time. Correct answers add bonus time. Wrong answers cost you time.'
        },
        {
            icon: <MdFavorite className="text-red-400 text-2xl" />,
            title: 'LIVES SYSTEM',
            desc: 'You have 3 lives per mission. Each wrong answer costs a life. Lose all lives and the bomb explodes.'
        },
        {
            icon: <MdCheckCircle className="text-green-400 text-2xl" />,
            title: 'MISSION SUCCESS',
            desc: 'Cut all wires before time runs out to defuse the bomb and save the day.'
        },
        {
            icon: <MdDangerous className="text-red-400 text-2xl" />,
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
        <div className="min-h-screen bg-gray-950 p-4">
            <div className="max-w-md mx-auto">

                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <Button variant="secondary" onClick={() => navigate('/menu')}>
                        <MdArrowBack className="text-xl" />
                    </Button>
                    <h1 className="text-2xl font-bold text-white tracking-widest">
                        HOW TO <span className="text-green-400">PLAY</span>
                    </h1>
                </div>

                {/* Steps */}
                <div className="flex flex-col gap-2 mb-4">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-3 flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">{step.icon}</div>
                            <div>
                                <h3 className="text-white font-bold text-xs tracking-widest mb-0.5">{step.title}</h3>
                                <p className="text-gray-500 text-xs">{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Difficulty Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 mb-4 shadow-2xl">
                    <h3 className="text-white font-bold mb-2 flex items-center gap-2 text-xs tracking-widest">
                        <GiTimeBomb className="text-green-400" /> DIFFICULTY <span className="text-green-400">LEVELS</span>
                    </h3>
                    <div className="grid grid-cols-5 gap-2 text-xs text-gray-600 mb-1 px-1">
                        <span>LEVEL</span>
                        <span>TIME</span>
                        <span>WIRES</span>
                        <span>LIVES</span>
                        <span>±TIME</span>
                    </div>
                    {difficulties.map((diff, index) => (
                        <div key={index} className="grid grid-cols-5 gap-2 text-xs bg-gray-800 border border-gray-700 rounded-lg p-2 mb-1.5">
                            <span className={`font-bold ${diff.color}`}>{diff.level}</span>
                            <span className="text-gray-400">{diff.time}</span>
                            <span className="text-gray-400">{diff.wires}</span>
                            <span className="text-gray-400">{diff.lives}</span>
                            <span className="text-gray-400">{diff.penalty}/{diff.bonus}</span>
                        </div>
                    ))}
                </div>

                {/* Start Button */}
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