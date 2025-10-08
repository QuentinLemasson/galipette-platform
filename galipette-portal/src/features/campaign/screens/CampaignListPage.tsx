import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../hooks';
import { CampaignCard } from '../components';
import { Typography } from '@/common/components';
import { Button, Card, Alert, AlertDescription } from '@/common/ui';
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
          <Typography variant="muted">Loading campaigns...</Typography>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading campaigns: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Typography variant="h1" className="text-2xl font-bold">
            My Campaigns
          </Typography>
          <Typography variant="muted" className="mt-1">
            Manage and view all your campaigns
          </Typography>
        </div>
        <Link to={PAGES.CAMPAIGN_CREATE.path}>
          <Button>+ Create Campaign</Button>
        </Link>
      </div>

      {!campaigns || campaigns.length === 0 ? (
        <Card className="text-center py-12">
          <Typography variant="body" className="mb-4">
            You don't have any campaigns yet. Why not create one?
          </Typography>
          <Link to={PAGES.CAMPAIGN_CREATE.path}>
            <Button>Create Your First Campaign</Button>
          </Link>
        </Card>
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
