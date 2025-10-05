import { useParams, Link } from 'react-router-dom';
import { useCampaign, useCampaignPlayers } from '../hooks';
import { CampaignStatusBadge, PlayerList } from '../components';
import { Button } from '@/common/ui';

export default function CampaignDashboardPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const id = campaignId ? parseInt(campaignId) : undefined;

  const { data: campaign, isLoading, error } = useCampaign(id);
  const { data: players, isLoading: playersLoading } = useCampaignPlayers(id);

  if (isLoading || playersLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Campaign not found</p>
          <Link
            to="/campaigns"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            ← Back to campaigns
          </Link>
        </div>
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
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          ← Back to campaigns
        </Link>
      </div>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        {campaign.description && (
          <p className="text-gray-600">{campaign.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Game Master: {campaign.gameMaster?.username || 'Unknown'}
        </p>
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
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Players</h2>
          {players && players.length > 0 ? (
            <PlayerList players={players} />
          ) : (
            <p className="text-gray-500">No players yet</p>
          )}
        </div>

        {/* Characters Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Characters
          </h2>
          <p className="text-gray-500">Character list coming soon...</p>
          {/* TODO: Add character list when available */}
        </div>
      </div>
    </section>
  );
}
