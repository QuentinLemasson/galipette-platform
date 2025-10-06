import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAncestry, useAncestryMutations } from '../hooks';
import { AncestryForm } from '../components';
import { Button } from '@/common/ui';
import { PAGES } from '@/app/routes/config/pages';
import type { UpdateAncestryDto } from '@galipette/shared';

export default function AncestriesEditPage() {
  const { ancestryId } = useParams<{ ancestryId: string }>();
  const navigate = useNavigate();
  const {
    data: ancestry,
    isLoading,
    error,
  } = useAncestry(ancestryId ? parseInt(ancestryId) : undefined);
  const { updateAncestry } = useAncestryMutations();

  const handleSubmit = async (data: UpdateAncestryDto) => {
    if (!ancestry) return;

    try {
      await updateAncestry.mutate(
        { id: ancestry.id, data },
        {
          onSuccess: updatedAncestry => {
            const detailsPath = PAGES.ANCESTRY_DETAILS.build?.({
              ancestryId: updatedAncestry.id.toString(),
            });
            navigate(detailsPath || `/ancestries/${updatedAncestry.id}`);
          },
        }
      );
    } catch (error) {
      console.error('Failed to update ancestry:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading ancestry...</p>
        </div>
      </div>
    );
  }

  if (error || !ancestry) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            {error?.message || 'Ancestry not found'}
          </p>
        </div>
        <Link to={PAGES.ANCESTRIES.path} className="mt-4 inline-block">
          <Button>← Back to Ancestries</Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={
            PAGES.ANCESTRY_DETAILS.build?.({
              ancestryId: ancestry.id.toString(),
            }) || `/ancestries/${ancestry.id}`
          }
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          ← Back to Details
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Ancestry</h1>
        <p className="text-sm mt-1 text-gray-600">
          Update ancestry information
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AncestryForm
          initialData={ancestry}
          onSubmit={handleSubmit}
          isLoading={updateAncestry.isPending}
        />

        {updateAncestry.isError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-600">
              {updateAncestry.error?.message || 'Failed to update ancestry'}
            </p>
          </div>
        )}
      </div>

      {/* Cancel Button */}
      <div className="mt-4">
        <Link
          to={
            PAGES.ANCESTRY_DETAILS.build?.({
              ancestryId: ancestry.id.toString(),
            }) || `/ancestries/${ancestry.id}`
          }
        >
          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </Button>
        </Link>
      </div>
    </section>
  );
}
