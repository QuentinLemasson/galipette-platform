/**
 * @fileOverview Reusable form textarea field component with label, error handling, and validation.
 * Built on shadcn Form + Textarea components with full react-hook-form integration.
 */

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Textarea,
} from '@/common/ui';

export interface FormFieldTextareaProps {
  /** Field name for react-hook-form registration */
  name: string;
  /** Label text displayed above the textarea */
  label: string;
  /** Placeholder text shown when textarea is empty */
  placeholder?: string;
  /** Whether the field is required (displays * after label) */
  required?: boolean;
  /** Whether the textarea is disabled */
  disabled?: boolean;
  /** Number of visible text rows */
  rows?: number;
  /** Optional description text shown below the textarea */
  description?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Reusable form textarea field with integrated validation and error handling.
 *
 * @example
 * ```tsx
 * <FormFieldTextarea
 *   name="description"
 *   label="Description"
 *   placeholder="Enter description"
 *   rows={4}
 * />
 * ```
 */
export const FormFieldTextarea = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  rows = 4,
  description,
  className,
}: FormFieldTextareaProps) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
