
import { GiWireCoil } from 'react-icons/gi';
import { MdCheckCircle } from 'react-icons/md';

const BombDisplay = ({ wiresCut, totalWires }) => {
    return (
        <div className="bg-gray-800 border border-red-700 rounded-lg p-4 mb-4">
            
            
            <div className="text-center mb-4">
                <h2 className="text-red-400 font-bold text-sm tracking-widest">⚠ EXPLOSIVE DEVICE DETECTED</h2>
            </div>

            
            <div className="flex flex-col gap-2">
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
                            className={`flex items-center gap-3 border rounded-lg p-2 transition-all duration-500
                                        ${isCut ? 'opacity-40 bg-gray-900' : `${color} bg-gray-700`}`}
                        >
                            {isCut
                                ? <MdCheckCircle className="text-green-400 text-xl" />
                                : <GiWireCoil className={`text-xl ${color.split(' ')[1]}`} />
                            }
                            <div className={`flex-1 h-1 rounded ${isCut ? 'bg-gray-600' : 'bg-current'}`}
                                 style={{ opacity: isCut ? 0.3 : 1 }}
                            />
                            <span className="text-xs font-bold">
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