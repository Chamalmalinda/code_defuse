const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent 
                            rounded-full animate-spin"
                style={{ filter: 'drop-shadow(0 0 6px #4ade80)' }}>
            </div>
            <p className="text-green-400 text-xs tracking-widest animate-pulse"
                style={{ textShadow: '0 0 8px rgba(74,222,128,0.6)' }}>{message}</p>
        </div>
    );
};

export default Loading;