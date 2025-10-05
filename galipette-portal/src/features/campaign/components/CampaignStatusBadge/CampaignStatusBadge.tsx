import { CampaignStatus } from '@galipette/shared';
import { cn } from '@/common/utils';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

const statusConfig = {
  [CampaignStatus.ACTIVE]: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  [CampaignStatus.PAUSED]: {
    label: 'Paused',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  [CampaignStatus.ENDED]: {
    label: 'Ended',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

export const CampaignStatusBadge = ({
  status,
  className,
}: CampaignStatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};
