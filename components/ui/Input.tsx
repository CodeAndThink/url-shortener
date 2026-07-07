import { inputStyles } from '@/styles/input';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: boolean;
    showClear?: boolean;
    onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
    className = '',
    error = false,
    showClear = false,
    onClear,
    ...props
}, ref) => {
    const baseClasses = inputStyles.base;
    const computedClasses = `${baseClasses} ${className}`.trim();

    return (
        <div className="w-full relative">
            <input
                className={computedClasses}
                ref={ref}
                {...props}
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
});

Input.displayName = "Input";
export default Input;