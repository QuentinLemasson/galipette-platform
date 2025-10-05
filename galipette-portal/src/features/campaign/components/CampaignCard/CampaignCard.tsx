import { Link } from 'react-router-dom';
import type { CampaignResponseDto } from '@galipette/shared';
import { CampaignStatusBadge } from '../CampaignStatusBadge/CampaignStatusBadge';

interface CampaignCardProps {
  campaign: CampaignResponseDto;
}

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
        <CampaignStatusBadge status={campaign.status} />
      </div>

      {campaign.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {campaign.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          GM:{' '}
          <span className="font-medium">
            {campaign.gameMaster?.username || 'Unknown'}
          </span>
        </div>

        <Link
          to={`/campaigns/${campaign.id}/dashboard`}
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
        >
          View Campaign →
        </Link>
      </div>
    </div>
  );
};
