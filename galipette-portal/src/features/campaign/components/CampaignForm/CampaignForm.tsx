import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCampaignSchema,
  updateCampaignSchema,
  CampaignStatus,
} from '@galipette/shared';
import type { UpdateCampaignDto } from '@galipette/shared';
import { Button, Form } from '@/common/ui';
import {
  FormFieldInput,
  FormFieldTextarea,
  FormFieldSelect,
} from '@/common/components';

interface CampaignFormProps {
  initialData?: Partial<UpdateCampaignDto>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const statusOptions = [
  { value: CampaignStatus.ACTIVE, label: 'Active' },
  { value: CampaignStatus.PAUSED, label: 'Paused' },
  { value: CampaignStatus.ENDED, label: 'Ended' },
];

export const CampaignForm = ({
  initialData,
  onSubmit,
  isLoading,
}: CampaignFormProps) => {
  const isEditMode = !!initialData;
  // Use update schema for edit mode (all optional), create schema partial for create mode
  const schema = isEditMode
    ? updateCampaignSchema
    : createCampaignSchema.omit({ ownerId: true });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: CampaignStatus.ACTIVE,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormFieldInput
          name="name"
          label="Campaign Name"
          placeholder="Enter campaign name"
          required
        />

        <FormFieldTextarea
          name="description"
          label="Description"
          placeholder="Describe your campaign..."
          rows={3}
        />

        {isEditMode && (
          <FormFieldSelect
            name="status"
            label="Status"
            options={statusOptions}
            placeholder="Select status"
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? 'Saving...'
            : isEditMode
              ? 'Save Changes'
              : 'Create Campaign'}
        </Button>
      </form>
    </Form>
  );
};
