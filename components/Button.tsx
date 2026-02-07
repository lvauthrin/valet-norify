import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  icon,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-3 border text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/30 shadow-lg",
    secondary: "border-transparent text-primary-700 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500",
    ghost: "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100 shadow-none"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};