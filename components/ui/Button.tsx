import React from 'react';
import { buttonStyles } from '@/styles/button';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'filled' | 'outline';
    children: React.ReactNode;
    href?: string;
    target?: string;
    rel?: string;
}

export default function Button({
    variant = 'filled',
    href,
    target,
    rel,
    children,
    className = '',
    ...props
}: ButtonProps) {

    const selectedStyle =
        variant === 'filled' ? buttonStyles.primary :
            variant === 'outline' ? buttonStyles.secondary :
                buttonStyles.text;

    const computedClasses = `${selectedStyle} ${className}`.trim();

    if (href) {
        return (
            <Link
                href={href}
                target={target}
                rel={rel}
                className={computedClasses}
            >
                {children}
            </Link>
        );
    }

    return (
        <button className={computedClasses} {...props}>
            {children}
        </button>
    );
}