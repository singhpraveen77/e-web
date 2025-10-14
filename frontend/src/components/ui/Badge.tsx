import React from "react";

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
}

const getVariantClasses = (variant: BadgeVariant = 'default') => {
  const variants = {
    default: "bg-[rgb(var(--card))] text-[rgb(var(--fg))] border border-[rgb(var(--border))]",
    primary: "bg-blue-600 text-white dark:bg-blue-500",
    secondary: "bg-gray-600 text-white dark:bg-gray-500",
    success: "bg-green-600 text-white",
    warning: "bg-yellow-600 text-white",
    danger: "bg-red-600 text-white",
    outline: "border border-[rgb(var(--border))] text-[rgb(var(--fg))] bg-transparent"
  };
  return variants[variant];
};

const getSizeClasses = (size: BadgeSize = 'md') => {
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base"
  };
  return sizes[size];
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', className, children, ...props }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const sizeClasses = getSizeClasses(size);
    
    return (
      <span
        ref={ref}
        className={`inline-flex items-center rounded-full font-medium transition-base ${variantClasses} ${sizeClasses} ${className || ''}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";