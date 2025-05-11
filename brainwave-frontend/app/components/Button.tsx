import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
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
      className={`px-6 py-3 font-semibold rounded-xl transition-all duration-200
        bg-[#0b021e] text-white hover:bg-[#1a093a] hover:shadow-lg
        focus:outline-none focus:ring-4 focus:ring-[#0b021e]/30
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-60 cursor-not-allowed hover:bg-[#0b021e]' : ''}
        ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;