export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const sizeStyles = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

export function Loading({ size = 'md', label = 'Loading...' }: LoadingProps) {
  return (
    <div className="flex items-center justify-center gap-3 py-8" role="status" aria-label={label}>
      <div
        className={`${sizeStyles[size]} rounded-full border-primary border-t-transparent animate-spin`}
        aria-hidden="true"
      />
      <span className="text-sm text-secondary">{label}</span>
    </div>
  );
}

Loading.displayName = 'Loading';
