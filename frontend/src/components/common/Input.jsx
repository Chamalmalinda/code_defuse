const Input = ({ type = 'text', placeholder = '', value, onChange, onKeyDown, className = '', disabled = false }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            disabled={disabled}
            className={`w-full px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700
                        text-gray-100 placeholder-gray-600 outline-none text-xs
                        focus:border-green-500 focus:ring-1 focus:ring-green-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 ${className}`}
        />
    );
};

export default Input;