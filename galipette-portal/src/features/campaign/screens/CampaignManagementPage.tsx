import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useCampaign,
  useCampaignPlayers,
  useCampaignMutations,
} from '../hooks';
import { CampaignForm, PlayerList } from '../components';
import type { UpdateCampaignDto } from '@galipette/shared';

export default function CampaignManagementPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const id = campaignId ? parseInt(campaignId) : undefined;

  const { data: campaign, isLoading } = useCampaign(id);
  const { data: players, isLoading: playersLoading } = useCampaignPlayers(id);
  const { updateCampaign, removePlayer } = useCampaignMutations();

  const handleUpdateCampaign = (data: UpdateCampaignDto) => {
    if (!id) return;
    updateCampaign.mutate(
      { id, data },
      {
        onSuccess: () => {
          navigate(`/campaigns/${id}/dashboard`);
        },
      }
    );
  };

  const handleRemovePlayer = (userId: number) => {
    if (!id) return;
    if (confirm('Are you sure you want to remove this player?')) {
      removePlayer.mutate({ campaignId: id, userId });
    }
  };

  if (isLoading || playersLoading || !campaign) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="container mx-auto p-6">
      {/* Back navigation */}
      <div className="mb-4">
        <Link
          to={`/campaigns/${campaignId}/dashboard`}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-gray-900">Manage Campaign</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Campaign Information
          </h2>
          <CampaignForm
            initialData={{
              name: campaign.name,
              description: campaign.description,
              status: campaign.status,
            }}
            onSubmit={handleUpdateCampaign}
            isLoading={updateCampaign.isPending}
          />
        </div>

        {/* Player Management */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Player Management
          </h2>
          {players && players.length > 0 ? (
            <PlayerList
              players={players}
              onRemovePlayer={handleRemovePlayer}
              isGM={true}
            />
          ) : (
            <p className="text-gray-500">No players yet</p>
          )}
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Add player functionality coming soon...
            </p>
            {/* TODO: Add "Add Player" functionality */}
          </div>
        </div>
      </div>
    </section>
  );
}
