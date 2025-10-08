import { CampaignStatus } from '@galipette/shared';
import { StatusBadge } from '@/common/components';

// TODO : generalize this in a configurable shared behaviour

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  className?: string;
}

const getStatusVariant = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'success' as const;
    case CampaignStatus.PAUSED:
      return 'warning' as const;
    case CampaignStatus.ENDED:
      return 'error' as const;
    default:
      return 'neutral' as const;
  }
};

const getStatusLabel = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'Active';
    case CampaignStatus.PAUSED:
      return 'Paused';
    case CampaignStatus.ENDED:
      return 'Ended';
    default:
      return status;
  }
};

export const CampaignStatusBadge = ({
  status,
  className,
}: CampaignStatusBadgeProps) => {
  const variant = getStatusVariant(status);
  const label = getStatusLabel(status);

  return (
    <StatusBadge variant={variant} className={className}>
      {label}
    </StatusBadge>
  );
};
