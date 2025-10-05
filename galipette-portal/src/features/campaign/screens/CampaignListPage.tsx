import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks';
import { CampaignCard } from '../components';
import { Button } from '@/common/ui';
import { PAGES } from '@/app/routes/config/pages';

export default function CampaignListPage() {
  // TODO: Get actual user ID from auth context
  const [userId] = useState<number>(1);

  const {
    data: campaigns,
    isLoading,
    error,
  } = useCampaigns({ playerId: userId });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">
            Error loading campaigns: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
          <p className="text-sm mt-1 text-gray-600">
            Manage and view all your campaigns
          </p>
        </div>
        <Link to={PAGES.CAMPAIGN_CREATE.path}>
          <Button>+ Create Campaign</Button>
        </Link>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-600 mb-4">
            You don't have any campaigns yet. Why not create one?
          </p>
          <Link to={PAGES.CAMPAIGN_CREATE.path}>
            <Button>Create Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </section>
  );
}
