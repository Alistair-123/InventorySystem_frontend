import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: ButtonVariant;
}

export const Button = ({
  label,
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const base = 'px-6 py-2 rounded font-medium transition';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    
  };

  return (
    <button className={`${base} ${variants[variant]}`} {...props}>
      {label}
    </button>
  );
};


