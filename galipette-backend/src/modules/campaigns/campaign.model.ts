import {
  Campaign as PrismaCampaign,
  CampaignUser as PrismaCampaignUser,
  CampaignRole,
} from '@prisma/client';

// Campaign domain model (extends Prisma generated type)
export interface Campaign extends PrismaCampaign {}

// Campaign User relationship model
export interface CampaignUser extends PrismaCampaignUser {}

// Campaign creation DTO
export interface CreateCampaignDto {
  name: string;
  description?: string;
  ownerId: number; // User ID of the campaign creator (will be GM)
}

// Campaign update DTO
export interface UpdateCampaignDto {
  name?: string;
  description?: string;
}

// Campaign user assignment DTO
export interface AddPlayerToCampaignDto {
  userId: number;
  role: CampaignRole;
}

// Campaign response DTO
export interface CampaignResponseDto {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  players?: CampaignPlayerDto[];
}

// Campaign player DTO
export interface CampaignPlayerDto {
  userId: number;
  username: string;
  email: string;
  role: CampaignRole;
}

// Function to map a Campaign entity to a CampaignResponseDto
export function mapToCampaignDto(
  campaign: Campaign,
  players: CampaignPlayerDto[] = [],
): CampaignResponseDto {
  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description ?? '',
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    players: players || undefined,
  };
}
