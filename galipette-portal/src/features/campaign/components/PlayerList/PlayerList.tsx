import type { CampaignPlayerDto } from '@galipette/shared';
import { UserItem } from '@/common/components';
import { Button } from '@/common/ui';

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
    return <p className="text-muted-foreground">No players yet</p>;
  }

  return (
    <div className="space-y-2">
      {players.map(player => (
        <UserItem
          key={player.userId}
          user={{
            username: player.username,
            email: player.email,
          }}
          role={player.role}
          actions={
            isGM && onRemovePlayer && player.role !== 'GM' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemovePlayer(player.userId)}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            ) : undefined
          }
        />
      ))}
    </div>
  );
};
