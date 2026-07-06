import { inputStyles } from '@/styles/input';
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'search';
    placeholder?: string;
    className?: string;
    error?: boolean;
    disabled?: boolean;
    register?: any;
    showClear?: boolean;
    onClear?: () => void;
}

export default function Input({
    type = 'text',
    placeholder,
    className = '',
    error = false,
    disabled = false,
    register,
    showClear = false,
    onClear,
}: InputProps) {

    const baseClasses = inputStyles.base;

    const computedClasses = `${baseClasses} ${className}`.trim();

    return (
        <div className="w-full relative">
            <input
                type={type}
                placeholder={placeholder}
                className={computedClasses}
                disabled={disabled}
                {...register}
            />
            {showClear && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    ✕
                </button>
            )}
        </div>
    );
}