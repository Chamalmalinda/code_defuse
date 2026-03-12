
const Loading = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent 
                            rounded-full animate-spin">
            </div>
            <p className="text-green-400 text-sm animate-pulse">{message}</p>
        </div>
    );
};

export default Loading;