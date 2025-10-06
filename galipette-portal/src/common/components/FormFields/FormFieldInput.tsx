/**
 * @fileOverview Reusable form input field component with label, error handling, and validation.
 * Built on shadcn Form + Input components with full react-hook-form integration.
 */

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from '@/common/ui';

export interface FormFieldInputProps {
  /** Field name for react-hook-form registration */
  name: string;
  /** Label text displayed above the input */
  label: string;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Whether the field is required (displays * after label) */
  required?: boolean;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Input type (text, email, password, number, etc.) */
  type?: string;
  /** Optional description text shown below the input */
  description?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Reusable form input field with integrated validation and error handling.
 *
 * @example
 * ```tsx
 * <FormFieldInput
 *   name="name"
 *   label="Name"
 *   placeholder="Enter name"
 *   required
 * />
 * ```
 */
export const FormFieldInput = ({
  name,
  label,
  placeholder,
  required,
  disabled,
  type = 'text',
  description,
  className,
}: FormFieldInputProps) => {
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
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
