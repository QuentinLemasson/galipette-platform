// Re-export shared types
export type {
  CampaignResponseDto,
  CampaignPlayerDto,
  CreateCampaignDto,
  UpdateCampaignDto,
  GameMasterDto,
} from '@galipette/shared';

export { CampaignStatus, CampaignRole } from '@galipette/shared';

// Frontend-specific types
export interface CampaignFilters {
  playerId?: number;
  status?: string;
}

export interface CampaignListState {
  campaigns: CampaignResponseDto[];
  loading: boolean;
  error: Error | null;
}

export interface CampaignDetailsState {
  campaign: CampaignResponseDto | null;
  players: CampaignPlayerDto[];
  characters: any[]; // TODO: Add character types when available
  loading: boolean;
  error: Error | null;
}

// Import the actual type for use
import type { CampaignResponseDto, CampaignPlayerDto } from '@galipette/shared';
