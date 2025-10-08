import { Link } from 'react-router-dom';
import type { CampaignResponseDto } from '@galipette/shared';
import { StatusBadge, UserAvatar } from '@/common/components';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from '@/common/ui';

interface CampaignCardProps {
  campaign: CampaignResponseDto;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'ACTIVE':
      return 'success' as const;
    case 'PAUSED':
      return 'warning' as const;
    case 'ENDED':
      return 'error' as const;
    default:
      return 'neutral' as const;
  }
};

export const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const statusVariant = getStatusVariant(campaign.status);

  return (
    <Card className="transition-shadow duration-200 hover:shadow-md cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold">
              {campaign.name}
            </CardTitle>
            {campaign.description && (
              <CardDescription className="text-sm mt-1">
                {campaign.description}
              </CardDescription>
            )}
          </div>
          <StatusBadge variant={statusVariant}>{campaign.status}</StatusBadge>
        </div>
      </CardHeader>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>GM:</span>
          <UserAvatar
            user={{
              username: campaign.gameMaster?.username || 'Unknown',
              email: campaign.gameMaster?.email,
            }}
            size="sm"
          />
          <span className="font-medium">
            {campaign.gameMaster?.username || 'Unknown'}
          </span>
        </div>

        <Button variant="link" asChild>
          <Link to={`/campaigns/${campaign.id}/dashboard`}>
            View Campaign →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
