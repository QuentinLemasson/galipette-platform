import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useCampaign,
  useCampaignPlayers,
  useCampaignMutations,
} from '../hooks';
import { CampaignForm, PlayerList } from '../components';
import { Typography } from '@/common/components';
import { Card } from '@/common/ui';
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
          <Typography variant="muted">Loading...</Typography>
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
          className="text-primary hover:text-primary/80 text-sm"
        >
          ← Back to dashboard
        </Link>
      </div>

      <Typography variant="h1" className="text-2xl font-bold mb-6">
        Manage Campaign
      </Typography>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Info */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Campaign Information
          </Typography>
          <CampaignForm
            initialData={{
              name: campaign.name,
              description: campaign.description,
              status: campaign.status,
            }}
            onSubmit={handleUpdateCampaign}
            isLoading={updateCampaign.isPending}
          />
        </Card>

        {/* Player Management */}
        <Card className="p-6">
          <Typography variant="h3" className="mb-4">
            Player Management
          </Typography>
          {players && players.length > 0 ? (
            <PlayerList
              players={players}
              onRemovePlayer={handleRemovePlayer}
              isGM={true}
            />
          ) : (
            <Typography variant="muted">No players yet</Typography>
          )}
          <div className="mt-4">
            <Typography variant="muted">
              Add player functionality coming soon...
            </Typography>
            {/* TODO: Add "Add Player" functionality */}
          </div>
        </Card>
      </div>
    </section>
  );
}
