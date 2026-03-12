
const Input = ({ type = 'text', placeholder = '', value, onChange, className = '', disabled = false }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-4 py-2 rounded bg-gray-800 border border-green-500 
                        text-green-400 placeholder-gray-500 outline-none
                        focus:border-green-300 focus:ring-1 focus:ring-green-300
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 ${className}`}
        />
    );
};

export default Input;