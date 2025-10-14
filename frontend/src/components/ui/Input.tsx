import React from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, showPasswordToggle, className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputType, setInputType] = React.useState(type);

    React.useEffect(() => {
      if (showPasswordToggle && type === 'password') {
        setInputType(showPassword ? 'text' : 'password');
      }
    }, [showPassword, type, showPasswordToggle]);

    const baseInputClasses = "w-full rounded-lg border bg-[rgb(var(--bg))] px-3 py-2.5 text-[rgb(var(--fg))] placeholder:text-[rgb(var(--muted))] transition-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--ring))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
    
    const borderClasses = error 
      ? "border-red-500 focus-visible:ring-red-500" 
      : "border-[rgb(var(--border))] focus-visible:ring-[rgb(var(--ring))]";

    const inputClasses = `${baseInputClasses} ${borderClasses} ${leftIcon ? 'pl-10' : ''} ${(rightIcon || showPasswordToggle) ? 'pr-10' : ''}`;

    return (
      <div className={`space-y-1 ${className || ''}`}>
        {label && (
          <label className="text-sm font-medium text-[rgb(var(--fg))]">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            {...props}
          />
          
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--fg))] transition-base"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          
          {rightIcon && !showPasswordToggle && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))]">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <div className="flex items-center gap-1 text-sm text-red-600">
            <AlertCircle size={14} />
            {error}
          </div>
        )}
        
        {helperText && !error && (
          <p className="text-sm text-[rgb(var(--muted))]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";