import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCampaignMutations } from '../hooks';
import { CampaignForm } from '../components';
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
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to campaigns
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Campaign
        </h1>
        <p className="text-gray-600 mt-1">
          Start a new adventure by creating your campaign
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Failed to create campaign: {error}</p>
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <CampaignForm
          onSubmit={handleCreateCampaign}
          isLoading={createCampaign.isPending}
        />
      </div>
    </section>
  );
}
