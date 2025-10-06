/**
 * @fileOverview Form component for creating and editing ancestries.
 * Refactored to use shadcn form components with full react-hook-form compatibility.
 * Implements dependency inversion for schema and button labels.
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form } from '@/common/ui';
import {
  FormFieldInput,
  FormFieldTextarea,
  ErrorBlock,
} from '@/common/components';

interface AncestryFormProps {
  /** Initial form data for edit mode */
  initialData?: Record<string, any>;
  /** Callback function when form is submitted */
  onSubmit: (data: any) => void;
  /** Whether the form is in a loading/submitting state */
  isLoading?: boolean;
  /** Error message to display (e.g., from mutation error) */
  error?: string | null;
  /** Validation schema for the form */
  schema: z.ZodType<any>;
  /** Submit button label */
  submitLabel: string;
  /** Loading submit button label */
  loadingLabel?: string;
}

/**
 * Form component for creating or editing an ancestry.
 * Supports both create and edit modes with automatic validation.
 * Includes integrated error display.
 *
 * Implements dependency inversion - schema and labels are injected as props
 * rather than determined internally.
 *
 * Note: The Form component is shadcn's wrapper around FormProvider (React Context),
 * while the <form> element is the actual HTML form that handles submission.
 *
 * @example
 * ```tsx
 * <AncestryForm
 *   initialData={ancestry}
 *   onSubmit={handleSubmit}
 *   isLoading={mutation.isPending}
 *   error={mutation.error?.message}
 *   schema={updateAncestrySchema}
 *   submitLabel="Save Changes"
 *   loadingLabel="Saving..."
 * />
 * ```
 */
export const AncestryForm = ({
  initialData,
  onSubmit,
  isLoading,
  error,
  schema,
  submitLabel,
  loadingLabel = 'Saving...',
}: AncestryFormProps) => {
  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: initialData || {
      name: '',
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormFieldInput
          name="name"
          label="Name"
          placeholder="Enter ancestry name"
          disabled={isLoading}
          required
        />

        <FormFieldTextarea
          name="description"
          label="Description"
          placeholder="Enter ancestry description"
          rows={4}
          disabled={isLoading}
        />

        {/* Integrated Error Display */}
        <ErrorBlock message={error} />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
