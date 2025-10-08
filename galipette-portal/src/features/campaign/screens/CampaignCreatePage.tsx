import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCampaignMutations } from '../hooks';
import { CampaignForm } from '../components';
import { Typography } from '@/common/components';
import { Card, Alert, AlertDescription } from '@/common/ui';
import type { CreateCampaignDto } from '@galipette/shared';

export default function CampaignCreatePage() {
  const navigate = useNavigate();
  const { createCampaign } = useCampaignMutations();
  const [error, setError] = useState<string | null>(null);

  // TODO: Get actual user ID from auth context
  const userId = 1;

  const handleCreateCampaign = async (
    data: Omit<CreateCampaignDto, 'ownerId'>
  ) => {
    try {
      setError(null);
      await createCampaign.mutate(
        { ...data, ownerId: userId },
        {
          onSuccess: result => {
            // Navigate to the newly created campaign dashboard
            navigate(`/campaigns/${result.id}/dashboard`);
          },
          onError: err => {
            setError(err.message);
          },
        }
      );
    } catch (err) {
      // Error is already handled in the callback
      console.error('Failed to create campaign:', err);
    }
  };

  return (
    <section className="container mx-auto p-6 max-w-2xl">
      {/* Back navigation */}
      <div className="mb-4">
        <Link
          to="/campaigns"
          className="text-primary hover:text-primary/80 text-sm"
        >
          ← Back to campaigns
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <Typography variant="h1" className="mb-2">
          Create New Campaign
        </Typography>
        <Typography variant="muted">
          Start a new adventure by creating your campaign
        </Typography>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            Failed to create campaign: {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card className="p-4">
        <CampaignForm
          onSubmit={handleCreateCampaign}
          isLoading={createCampaign.isPending}
        />
      </Card>
    </section>
  );
}
