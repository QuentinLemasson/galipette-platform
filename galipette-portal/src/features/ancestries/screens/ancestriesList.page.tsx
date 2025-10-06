import { Link } from 'react-router-dom';
import { useAncestries } from '../hooks';
import { AncestryCard } from '../components';
import { Button } from '@/common/ui';
import { PAGES } from '@/app/routes/config/pages';

export default function AncestriesListPage() {
  const { data: ancestries, isLoading, error } = useAncestries();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading ancestries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            Error loading ancestries: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ancestries</h1>
          <p className="text-sm mt-1 text-gray-600">
            Browse all available character ancestries
          </p>
        </div>
        <Link to={PAGES.ANCESTRY_CREATE.path}>
          <Button>+ Create Ancestry</Button>
        </Link>
      </div>

      {!ancestries || ancestries.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            No ancestries found. Create the first one!
          </p>
          <Link to={PAGES.ANCESTRY_CREATE.path}>
            <Button>Create First Ancestry</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ancestries.map(ancestry => (
            <AncestryCard key={ancestry.id} ancestry={ancestry} />
          ))}
        </div>
      )}
    </section>
  );
}
