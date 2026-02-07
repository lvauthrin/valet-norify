import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700 ml-1">
        {label}
      </label>
      <input
        id={inputId}
        className={`
          appearance-none block w-full px-4 py-3 
          border border-gray-300 rounded-xl shadow-sm 
          placeholder-gray-400 
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
          transition-colors duration-200
          text-gray-900
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
        `}
        {...props}
      />
      {error && <p className="text-sm text-red-600 mt-1 ml-1">{error}</p>}
    </div>
  );
};