/**
 * @fileOverview Reusable error display component using shadcn Alert.
 * Follows UI component rules by using existing shadcn components.
 */

import { Alert, AlertDescription, AlertTitle } from '@/common/ui';
import { cn } from '@/common/utils/shadcn.util';

interface ErrorBlockProps {
  /** Error message to display */
  message?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the error block (useful for conditional rendering) */
  show?: boolean;
  /** Custom error title */
  title?: string;
}

/**
 * Reusable error display component using shadcn Alert.
 * Provides consistent error styling with proper accessibility.
 *
 * @example
 * ```tsx
 * <ErrorBlock
 *   message={error?.message}
 *   title="Custom Error Title"
 *   show={!!error}
 * />
 * ```
 */
export const ErrorBlock = ({
  message,
  className,
  show = true,
  title = 'Error',
}: ErrorBlockProps) => {
  if (!show || !message) {
    return null;
  }

  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};
