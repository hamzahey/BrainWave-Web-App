

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean; // Optional fullWidth prop
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  disabled = false,
  fullWidth = false,
  ...props 
}) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition ${
        fullWidth ? 'w-full' : ''
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
