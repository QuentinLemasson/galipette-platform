import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAncestry, useAncestryMutations } from '../hooks';
import { Button } from '@/common/ui';
import { PAGES } from '@/app/routes/config/pages';

export default function AncestriesDetailsPage() {
  const { ancestryId } = useParams<{ ancestryId: string }>();
  const navigate = useNavigate();
  const {
    data: ancestry,
    isLoading,
    error,
  } = useAncestry(ancestryId ? parseInt(ancestryId) : undefined);
  const { deleteAncestry } = useAncestryMutations();

  const handleDelete = async () => {
    if (!ancestry) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${ancestry.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteAncestry.mutate(ancestry.id, {
        onSuccess: () => {
          navigate(PAGES.ANCESTRIES.path);
        },
      });
    } catch (error) {
      console.error('Failed to delete ancestry:', error);
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
      <div className="container mx-auto p-6">
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

  const editPath = PAGES.ANCESTRY_EDIT.build?.({
    ancestryId: ancestry.id.toString(),
  });

  return (
    <section className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            to={PAGES.ANCESTRIES.path}
            className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Ancestries
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{ancestry.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link to={editPath || `/ancestries/${ancestry.id}/edit`}>
            <Button>Edit</Button>
          </Link>
          <Button
            onClick={handleDelete}
            disabled={deleteAncestry.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteAncestry.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Name</h2>
            <p className="text-lg text-gray-900">{ancestry.name}</p>
          </div>

          {ancestry.description && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 mb-1">
                Description
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {ancestry.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
