/**
 * @fileOverview Typography utilities component with variant-based styling.
 * Provides consistent typography patterns using theme-aware design tokens.
 */

import { cn } from '@/common/utils';
import type { ReactNode } from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'lead'
  | 'muted';

export interface TypographyProps {
  /** Typography variant */
  variant: TypographyVariant;
  /** Content to display */
  children: ReactNode;
  /** HTML element to render */
  as?: keyof React.JSX.IntrinsicElements;
  /** Additional CSS class names */
  className?: string;
}

const variantStyles = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight',
  body: 'leading-7 [&:not(:first-child)]:mt-6',
  'body-sm': 'text-sm leading-6',
  caption: 'text-sm text-muted-foreground',
  lead: 'text-xl text-muted-foreground',
  muted: 'text-sm text-muted-foreground',
};

const defaultElements = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  body: 'p',
  'body-sm': 'p',
  caption: 'p',
  lead: 'p',
  muted: 'p',
} as const;

/**
 * Typography component with consistent styling variants.
 *
 * @example
 * ```tsx
 * <Typography variant="h1">Main Heading</Typography>
 * <Typography variant="body" as="div">Body text</Typography>
 * <Typography variant="muted">Secondary text</Typography>
 * ```
 */
export const Typography = ({
  variant,
  children,
  as,
  className,
}: TypographyProps) => {
  const Element = (as ||
    defaultElements[variant]) as keyof React.JSX.IntrinsicElements;
  const styles = variantStyles[variant];

  return <Element className={cn(styles, className)}>{children}</Element>;
};
