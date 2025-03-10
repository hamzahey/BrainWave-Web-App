import React from "react";

interface InputProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({label, type, value, onChange, placeholder}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}</label>
            <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
            />
        </div>
    )
}

export default Input