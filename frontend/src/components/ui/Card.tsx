import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const getVariantClasses = (variant: CardProps['variant'] = 'default') => {
  const variants = {
    default: "bg-[rgb(var(--card))] border border-[rgb(var(--border))] shadow-sm",
    elevated: "bg-[rgb(var(--card))] shadow-md hover:shadow-lg transition-shadow",
    outlined: "bg-[rgb(var(--bg))] border-2 border-[rgb(var(--border))]"
  };
  return variants[variant];
};

const getPaddingClasses = (padding: CardProps['padding'] = 'md') => {
  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8"
  };
  return paddings[padding];
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', padding = 'md', className, children, ...props }, ref) => {
    const variantClasses = getVariantClasses(variant);
    const paddingClasses = getPaddingClasses(padding);
    
    return (
      <div
        ref={ref}
        className={`rounded-xl ${variantClasses} ${paddingClasses} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

// Card sub-components for better structure
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`space-y-1.5 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3 ref={ref} className={`text-lg font-semibold leading-none tracking-tight text-[rgb(var(--fg))] ${className || ''}`} {...props}>
      {children}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p ref={ref} className={`text-sm text-[rgb(var(--muted))] ${className || ''}`} {...props}>
      {children}
    </p>
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={`flex items-center pt-0 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";