import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const getVariantClasses = (variant: ButtonVariant = 'primary') => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400",
    secondary: "bg-[rgb(var(--card))] text-[rgb(var(--fg))] border border-[rgb(var(--border))] hover:bg-[rgb(var(--bg))]",
    success: "bg-green-600 text-white hover:bg-green-500",
    danger: "bg-red-600 text-white hover:bg-red-500",
    outline: "border border-[rgb(var(--border))] bg-transparent text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))]",
    ghost: "text-[rgb(var(--fg))] hover:bg-[rgb(var(--card))] hover:text-[rgb(var(--fg))]",
    link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto"
  };
  return variants[variant];
};

const getSizeClasses = (size: ButtonSize = 'md') => {
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-base",
    xl: "h-12 px-8 text-lg",
    icon: "h-10 w-10 p-0"
  };
  return sizes[size];
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, leftIcon, rightIcon, children, disabled, className, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = variant === 'link' ? '' : getSizeClasses(size);
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className || ''}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && !loading && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";