import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCampaignSchema,
  updateCampaignSchema,
  CampaignStatus,
} from '@galipette/shared';
import type { UpdateCampaignDto } from '@galipette/shared';
import { Button } from '@/common/ui';

interface CampaignFormProps {
  initialData?: Partial<UpdateCampaignDto>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      name: '',
      description: '',
      status: CampaignStatus.ACTIVE,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Campaign Name *
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter campaign name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your campaign..."
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message as string}
          </p>
        )}
      </div>

      {isEditMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={CampaignStatus.ACTIVE}>Active</option>
            <option value={CampaignStatus.PAUSED}>Paused</option>
            <option value={CampaignStatus.ENDED}>Ended</option>
          </select>
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading
          ? 'Saving...'
          : isEditMode
            ? 'Save Changes'
            : 'Create Campaign'}
      </Button>
    </form>
  );
};
