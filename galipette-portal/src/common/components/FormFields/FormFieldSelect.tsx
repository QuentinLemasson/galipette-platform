/**
 * @fileOverview Reusable form select field component with label, error handling, and validation.
 * Built on shadcn Form + Select components with full react-hook-form integration.
 */

import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/common/ui';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/common/ui';

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldSelectProps {
  /** Field name for react-hook-form registration */
  name: string;
  /** Label text displayed above the select */
  label: string;
  /** Array of options for the select */
  options: SelectOption[];
  /** Placeholder text shown when no option is selected */
  placeholder?: string;
  /** Whether the field is required (displays * after label) */
  required?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Optional description text shown below the select */
  description?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Reusable form select field with integrated validation and error handling.
 *
 * @example
 * ```tsx
 * <FormFieldSelect
 *   name="status"
 *   label="Status"
 *   options={[
 *     { value: 'active', label: 'Active' },
 *     { value: 'paused', label: 'Paused' }
 *   ]}
 *   placeholder="Select status"
 *   required
 * />
 * ```
 */
export const FormFieldSelect = ({
  name,
  label,
  options,
  placeholder,
  required,
  disabled,
  description,
  className,
}: FormFieldSelectProps) => {
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
