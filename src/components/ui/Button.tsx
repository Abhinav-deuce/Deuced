import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    style,
    ...props
}) => {
    const baseStyle = {
        padding: '0.875rem 1.5rem',
        borderRadius: '9999px', // Pill shape
        fontSize: '1rem',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s',
        border: 'none',
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
    };

    const variants = {
        primary: {
            backgroundColor: 'var(--primary)',
            color: 'var(--text-main)',
        },
        secondary: {
            backgroundColor: 'var(--card-bg)',
            color: 'var(--text-main)',
            border: '2px solid var(--secondary)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
            border: '1px solid #d1d5db',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--text-main)',
            padding: '0.5rem',
        }
    };

    return (
        <button
            style={{ ...baseStyle, ...variants[variant], ...style }}
            className={`btn-${variant} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
