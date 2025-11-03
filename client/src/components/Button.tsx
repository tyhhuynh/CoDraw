export type ButtonVariant = "primary" | "tool-active" | "tool-inactive" | "action";
export type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
};

export default function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  disabled = false,
  className = "" 
}: ButtonProps) {

  const baseClasses = "flex items-center justify-center rounded border transition-colors touch-manipulation cursor-pointer";
  

  const variantClasses = {
    primary: "bg-button-active-bg text-button-active-text hover:opacity-90",
    "tool-active": "bg-button-active-bg text-button-active-text",
    "tool-inactive": "bg-button-inactive-bg text-button-inactive-text hover:opacity-80",
    action: "bg-button-inactive-bg text-button-inactive-text hover:opacity-80"
  };
  
  const sizeClasses = {
    sm: "px-2 py-1.5 min-h-[36px]",
    md: "px-4 py-2.5 min-h-[44px]",
    lg: "px-6 py-3 min-h-[48px]"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}