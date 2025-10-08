/**
 * @fileOverview Generic status badge component with predefined color schemes.
 * Built on shadcn Badge component with consistent status styling.
 */

import { cn } from '@/common/utils';
import { Badge } from '@/common/ui';

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral';

export interface StatusBadgeProps {
  /** Status text to display */
  children: string;
  /** Status variant for color scheme */
  variant: StatusVariant;
  /** Badge size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class names */
  className?: string;
}

const statusConfig = {
  success: {
    className:
      'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
  },
  warning: {
    className:
      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  },
  error: {
    className:
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  },
  info: {
    className:
      'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
  },
  neutral: {
    className: 'bg-muted text-muted-foreground border-border',
  },
};

const sizeConfig = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

/**
 * Generic status badge with predefined color schemes.
 *
 * @example
 * ```tsx
 * <StatusBadge variant="success" size="md">
 *   Active
 * </StatusBadge>
 * ```
 */
export const StatusBadge = ({
  children,
  variant,
  size = 'md',
  className,
}: StatusBadgeProps) => {
  const config = statusConfig[variant];
  const sizeClasses = sizeConfig[size];

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center rounded-full font-medium border',
        config.className,
        sizeClasses,
        className
      )}
    >
      {children}
    </Badge>
  );
};
