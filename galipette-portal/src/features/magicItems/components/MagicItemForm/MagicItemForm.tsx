/**
 * @fileOverview Create/edit form for a magic item.
 *
 * Uses an internal Zod schema that coerces the string-based <Select> value
 * into the numeric `typeId` expected by the API contract. The submit handler
 * receives a fully typed payload ready to be sent through the mutation hook.
 */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Form } from '@/common/ui';
import {
  ErrorBlock,
  FormFieldInput,
  FormFieldSelect,
  FormFieldTextarea,
} from '@/common/components';
import type { MagicItemTypeResponseDto } from '@galipette/shared';

const magicItemFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom doit faire au plus 100 caracteres'),
  description: z
    .string()
    .min(1, 'La description est requise')
    .max(2000, 'La description doit faire au plus 2000 caracteres'),
  image: z
    .union([
      z.string().url("L'URL de l'image n'est pas valide"),
      z.literal(''),
    ])
    .optional()
    .transform(value =>
      value === '' || value === undefined ? undefined : value
    ),
  typeId: z
    .string()
    .min(1, 'Le type est requis')
    .refine(value => Number.isFinite(Number(value)) && Number(value) > 0, {
      message: 'Type invalide',
    }),
});

type MagicItemFormValues = z.input<typeof magicItemFormSchema>;

export interface MagicItemFormSubmitData {
  name: string;
  description: string;
  image?: string;
  typeId: number;
}

interface MagicItemFormProps {
  /** Initial values for edit mode */
  initialData?: Partial<MagicItemFormValues>;
  /** Callback receiving the typed, ready-to-submit payload */
  onSubmit: (values: MagicItemFormSubmitData) => void;
  /** Available types to populate the type Select */
  types: MagicItemTypeResponseDto[];
  /** Whether the form is currently submitting */
  isLoading?: boolean;
  /** Error message to display (e.g. mutation error) */
  error?: string | null;
  /** Submit button label */
  submitLabel: string;
  /** Loading submit button label */
  loadingLabel?: string;
}

const buildDefaultValues = (
  initialData?: Partial<MagicItemFormValues>
): MagicItemFormValues => ({
  name: initialData?.name ?? '',
  description: initialData?.description ?? '',
  image: initialData?.image ?? '',
  typeId: initialData?.typeId ?? '',
});

/**
 * Form component for creating or editing a magic item.
 */
export const MagicItemForm = ({
  initialData,
  onSubmit,
  types,
  isLoading,
  error,
  submitLabel,
  loadingLabel = 'Enregistrement...',
}: MagicItemFormProps) => {
  const form = useForm<MagicItemFormValues>({
    resolver: zodResolver(magicItemFormSchema),
    defaultValues: buildDefaultValues(initialData),
  });

  const typeOptions = types.map(type => ({
    value: type.id.toString(),
    label: type.name,
  }));

  const handleSubmit = (values: MagicItemFormValues): void => {
    onSubmit({
      name: values.name,
      description: values.description,
      image:
        values.image && values.image.length > 0 ? values.image : undefined,
      typeId: Number(values.typeId),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <FormFieldInput
          name="name"
          label="Nom"
          placeholder="Nom de l'objet magique"
          disabled={isLoading}
          required
        />

        <FormFieldSelect
          name="typeId"
          label="Type"
          placeholder="Selectionner un type"
          options={typeOptions}
          disabled={isLoading || types.length === 0}
          required
          description={
            types.length === 0
              ? 'Aucun type disponible. Creez-en un dans la gestion des types.'
              : undefined
          }
        />

        <FormFieldInput
          name="image"
          label="URL de l'image"
          type="url"
          placeholder="https://..."
          disabled={isLoading}
          description="Optionnel. Une image carree ou 4:3 fonctionne le mieux."
        />

        <FormFieldTextarea
          name="description"
          label="Description"
          placeholder="Effets, lore, conditions d'utilisation..."
          rows={5}
          disabled={isLoading}
          required
        />

        <ErrorBlock message={error ?? undefined} />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? loadingLabel : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
