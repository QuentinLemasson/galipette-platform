import { Link } from 'react-router-dom';
import type { AncestryResponseDto } from '@galipette/shared';
import { PAGES } from '@/app/routes/config/pages';

interface AncestryCardProps {
  ancestry: AncestryResponseDto;
}

export const AncestryCard = ({ ancestry }: AncestryCardProps) => {
  const detailsPath = PAGES.ANCESTRY_DETAILS.build?.({
    ancestryId: ancestry.id.toString(),
  });

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{ancestry.name}</h3>
      </div>

      {ancestry.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {ancestry.description}
        </p>
      )}

      <div className="flex items-center justify-end mt-auto pt-3 border-t border-gray-100">
        <Link
          to={detailsPath || `/ancestries/${ancestry.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
};
