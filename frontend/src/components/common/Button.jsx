const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {

    const variants = {
        primary:   'bg-green-500 hover:bg-green-400 text-black font-bold',
        danger:    'bg-red-600 hover:bg-red-500 text-white font-bold',
        secondary: 'bg-gray-700 hover:bg-gray-600 text-green-400 font-bold',
        outline:   'border border-green-500 text-green-400 hover:bg-green-500 hover:text-black font-bold',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-3 py-1.5 rounded-lg text-xs tracking-widest transition-all duration-200 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;