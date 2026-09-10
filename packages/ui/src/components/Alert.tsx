import type { HTMLAttributes } from 'react';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
}

const variantStyles = {
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  success:
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
  warning:
    'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
  error:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
};

export function Alert({ children, variant = 'info', title, className = '', ...props }: AlertProps) {
  const role = variant === 'error' ? 'alert' : 'status';
  return (
    <div
      className={`p-4 rounded-lg border ${variantStyles[variant]} ${className}`}
      role={role}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      {...props}
    >
      {title && <h4 className="font-medium mb-1">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  );
}

Alert.displayName = 'Alert';
