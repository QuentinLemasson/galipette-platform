import { Link, useNavigate } from 'react-router-dom';
import { useAncestryMutations } from '../hooks';
import { AncestryForm } from '../components';
import { Button } from '@/common/ui';
import { PAGES } from '@/app/routes/config/pages';
import { createAncestrySchema } from '@galipette/shared';
import type { CreateAncestryDto } from '@galipette/shared';

export default function AncestriesCreatePage() {
  const navigate = useNavigate();
  const { createAncestry } = useAncestryMutations();

  const handleSubmit = async (data: CreateAncestryDto) => {
    await createAncestry.mutate(data, {
      onSuccess: newAncestry => {
        const detailsPath = PAGES.ANCESTRY_DETAILS.build?.({
          ancestryId: newAncestry.id.toString(),
        });
        navigate(detailsPath || `/ancestries/${newAncestry.id}`);
      },
    });
  };

  return (
    <section className="container mx-auto p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={PAGES.ANCESTRIES.path}
          className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block"
        >
          ← Back to Ancestries
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create Ancestry</h1>
        <p className="text-sm mt-1 text-gray-600">
          Add a new character ancestry to the system
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AncestryForm
          onSubmit={handleSubmit}
          isLoading={createAncestry.isPending}
          error={createAncestry.error?.message}
          schema={createAncestrySchema}
          submitLabel="Create Ancestry"
          loadingLabel="Creating..."
        />
      </div>

      {/* Cancel Button */}
      <div className="mt-4">
        <Link to={PAGES.ANCESTRIES.path}>
          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Cancel
          </Button>
        </Link>
      </div>
    </section>
  );
}
