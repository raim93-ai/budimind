export interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
      {message}
    </p>
  );
}

FormError.displayName = 'FormError';
