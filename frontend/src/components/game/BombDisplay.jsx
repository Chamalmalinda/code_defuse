import { GiElectric } from 'react-icons/gi';
import { MdCheckCircle } from 'react-icons/md';

const BombDisplay = ({ wiresCut, totalWires }) => {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-2.5 mb-3">
            
            
            <div className="text-center mb-1.5">
                <h2 className="text-red-400 font-bold text-xs tracking-widest"
                    style={{ textShadow: '0 0 8px rgba(248,113,113,0.5)' }}>⚠ EXPLOSIVE DEVICE DETECTED</h2>
            </div>

            
            <div className="flex flex-col gap-1">
                {Array.from({ length: totalWires }).map((_, index) => {
                    const isCut = index < wiresCut;
                    const colors = [
                        'border-red-500 text-red-400',
                        'border-blue-500 text-blue-400',
                        'border-yellow-500 text-yellow-400',
                        'border-green-500 text-green-400',
                        'border-purple-500 text-purple-400',
                        'border-orange-500 text-orange-400',
                        'border-pink-500 text-pink-400',
                    ];
                    const color = colors[index % colors.length];

                    return (
                        <div
                            key={index}
                            className={`flex items-center gap-2 border rounded-lg p-1 transition-all duration-500
                                        ${isCut ? 'opacity-40 bg-gray-800' : `${color} bg-gray-800`}`}
                        >
                            {isCut
                                ? <MdCheckCircle className="text-green-400 text-sm"
                                    style={{ filter: 'drop-shadow(0 0 4px #4ade80)' }} />
                                : <GiElectric className={`text-sm ${color.split(' ')[1]}`}
                                    style={{ filter: `drop-shadow(0 0 4px currentColor)` }} />
                            }
                            <div className={`flex-1 h-0.5 rounded ${isCut ? 'bg-gray-600' : 'bg-current'}`}
                                 style={{ opacity: isCut ? 0.3 : 1 }}
                            />
                            <span className="text-xs font-bold" style={{ fontSize: '10px' }}>
                                {isCut ? 'CUT' : `WIRE ${index + 1}`}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BombDisplay;