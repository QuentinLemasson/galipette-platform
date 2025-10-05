import type { CampaignPlayerDto } from '@galipette/shared';

interface PlayerListProps {
  players: CampaignPlayerDto[];
  onRemovePlayer?: (userId: number) => void;
  isGM?: boolean;
}

export const PlayerList = ({
  players,
  onRemovePlayer,
  isGM,
}: PlayerListProps) => {
  if (!players || players.length === 0) {
    return <p className="text-gray-500">No players yet</p>;
  }

  return (
    <div className="space-y-2">
      {players.map(player => (
        <div
          key={player.userId}
          className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {player.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{player.username}</div>
              <div className="text-sm text-gray-500">{player.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-sm px-2 py-1 rounded ${
                player.role === 'GM'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {player.role}
            </span>
            {isGM && onRemovePlayer && player.role !== 'GM' && (
              <button
                onClick={() => onRemovePlayer(player.userId)}
                className="text-sm text-red-600 hover:text-red-800 px-2 py-1"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
