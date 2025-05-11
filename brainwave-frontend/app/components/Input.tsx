// components/Input.tsx
import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string; // Add this line
}

const Input = ({ 
  label, 
  className = '', 
  labelClassName = '', 
  ...props 
}: InputProps) => {
  return (
    <div className="mb-4">
      <label className={`block text-sm font-medium mb-2 ${labelClassName}`}>
        {label}
      </label>
      <input
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;