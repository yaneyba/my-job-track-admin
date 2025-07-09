import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

export function Input({ 
  className, 
  label, 
  error, 
  hint,
  leftIcon,
  rightIcon,
  variant = 'default',
  type,
  onPaste, 
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (onPaste) {
      onPaste(e);
    }
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const baseClasses = cn(
    'w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'text-gray-900 bg-white',
    leftIcon && 'pl-10',
    (rightIcon || type === 'password') && 'pr-10',
    error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
    variant === 'filled' && 'bg-gray-50 border-gray-200',
    isFocused && 'ring-2 ring-blue-500 ring-opacity-20',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{leftIcon}</div>
          </div>
        )}
        
        <input
          type={inputType}
          className={baseClasses}
          style={{ 
            userSelect: 'text',
            WebkitUserSelect: 'text',
            MozUserSelect: 'text'
          }}
          onPaste={handlePaste}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        )}
        
        {rightIcon && type !== 'password' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="text-gray-400">{rightIcon}</div>
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Textarea({ 
  className, 
  label, 
  error, 
  hint,
  ...props 
}: TextareaProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = cn(
    'w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'text-gray-900 bg-white resize-vertical',
    error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
    isFocused && 'ring-2 ring-blue-500 ring-opacity-20',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <textarea
        className={baseClasses}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ 
  className, 
  label, 
  error, 
  hint,
  options,
  ...props 
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = cn(
    'w-full px-3 py-2 border rounded-md shadow-sm transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    'text-gray-900 bg-white',
    error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300',
    isFocused && 'ring-2 ring-blue-500 ring-opacity-20',
    className
  );

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <select
        className={baseClasses}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
      
      {error && (
        <p className="text-sm text-red-600 animate-in slide-in-from-top-1 duration-200">{error}</p>
      )}
    </div>
  );
}