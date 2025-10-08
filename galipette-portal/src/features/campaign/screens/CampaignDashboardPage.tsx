import { useParams, Link } from 'react-router-dom';
import { useCampaign, useCampaignPlayers } from '../hooks';
import { CampaignStatusBadge, PlayerList } from '../components';
import { Typography } from '@/common/components';
import { Button, Card, Alert, AlertDescription } from '@/common/ui';

export default function CampaignDashboardPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const id = campaignId ? parseInt(campaignId) : undefined;

  const { data: campaign, isLoading, error } = useCampaign(id);
  const { data: players, isLoading: playersLoading } = useCampaignPlayers(id);

  if (isLoading || playersLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Typography variant="muted">Loading campaign...</Typography>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Campaign not found
            <Link
              to="/campaigns"
              className="text-primary hover:text-primary/80 underline mt-2 inline-block ml-2"
            >
              ← Back to campaigns
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // TODO: Check if current user is GM from auth context
  const isGM = campaign.gameMaster?.userId === 1; // Temporary hardcoded

  return (
    <section className="container mx-auto p-6">
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
        <div className="flex items-center gap-3 mb-2">
          <Typography variant="h1" className="text-2xl font-bold">
            {campaign.name}
          </Typography>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        {campaign.description && (
          <Typography variant="body" className="mt-1">
            {campaign.description}
          </Typography>
        )}
        <Typography variant="muted" className="mt-1">
          Game Master: {campaign.gameMaster?.username || 'Unknown'}
        </Typography>
      </div>

      {/* Actions */}
      {isGM && (
        <div className="mb-6">
          <Link to={`/campaigns/${campaignId}/management`}>
            <Button>⚙️ Manage Campaign</Button>
          </Link>
        </div>
      )}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Players Section */}
        <Card className="p-6 bg-transparent">
          <Typography variant="h3" className="mb-4">
            Players
          </Typography>
          {players && players.length > 0 ? (
            <PlayerList players={players} />
          ) : (
            <Typography variant="muted">No players yet</Typography>
          )}
        </Card>

        {/* Characters Section */}
        <Card className="p-6 bg-transparent">
          <Typography variant="h3" className="mb-4">
            Characters
          </Typography>
          <Typography variant="muted">Character list coming soon...</Typography>
          {/* TODO: Add character list when available */}
        </Card>
      </div>
    </section>
  );
}
