  import React from 'react';

  type InputVariant = 'default' | 'auth' | 'search';

  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    variant?: InputVariant;
  }

  export const Input = ({
    label,
    error,
    variant = 'default',
    className = '',
    ...props
  }: InputProps) => {
    const base =
      'w-full rounded px-3 py-2 text-sm border focus:outline-none focus:ring-2';

    const variants = {
      default: 'border-gray-300 focus:ring-blue-500',
      auth: 'border-gray-400 bg-gray-50 focus:ring-indigo-500',
      search: 'border-gray-300 pl-10 focus:ring-green-500',
    };

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm text-black font-poppins">
            {label}
          </label>
        )}

        <input
          className={`${base} ${variants[variant]} ${error ? 'border-red-500' : ''} ${className}`}
          {...props}
        />

        {error && (
          <span className="text-xs text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  };
