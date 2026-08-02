interface ErrorMessageProps {
  children: React.ReactNode;
  id?: string;
}

/** Common validation-error text shown under an invalid input. */
export function ErrorMessage({ children, id }: ErrorMessageProps) {
  return (
    <p id={id} role="alert" className="text-sm text-destructive">
      {children}
    </p>
  );
}
