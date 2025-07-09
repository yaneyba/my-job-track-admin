import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, onPaste, ...props }: InputProps) {
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    // Ensure paste is always allowed
    if (onPaste) {
      onPaste(e);
    }
  };
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          'text-gray-900 bg-white',
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '',
          className
        )}
        style={{ 
          userSelect: 'text',
          WebkitUserSelect: 'text',
          MozUserSelect: 'text'
        }}
        onPaste={handlePaste}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
