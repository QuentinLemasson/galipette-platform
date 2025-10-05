import {
  Campaign as PrismaCampaign,
  CampaignUser as PrismaCampaignUser,
} from '@prisma/client';
import {
  CreateCampaignDto,
  UpdateCampaignDto,
  AddPlayerToCampaignDto,
  CampaignResponseDto,
  CampaignPlayerDto,
  CampaignRole,
  CampaignStatus,
  campaignResponseSchema,
} from '@galipette/shared';

// ============================================
// DOMAIN MODEL (Internal Backend Type)
// ============================================

/**
 * Campaign domain model (extends Prisma generated type)
 * This is the internal representation used within the backend
 */
export interface Campaign extends PrismaCampaign {}

/**
 * Campaign User relationship model
 * This is the internal representation used within the backend
 */
export interface CampaignUser extends PrismaCampaignUser {}

// ============================================
// RE-EXPORT SHARED DTOs & ENUMS
// ============================================

/**
 * Re-export DTOs and enums from shared library for convenience
 * These are the types used at API boundaries
 */
export type {
  CreateCampaignDto,
  UpdateCampaignDto,
  AddPlayerToCampaignDto,
  CampaignResponseDto,
  CampaignPlayerDto,
};
export { CampaignRole, CampaignStatus };

// ============================================
// MAPPING FUNCTIONS
// ============================================

/**
 * Maps a Prisma Campaign entity to a CampaignResponseDto
 * This function acts as the boundary between internal database
 * representation and external API representation
 *
 * @param campaign - The Prisma Campaign entity from the database
 * @param players - Optional list of players in the campaign
 * @returns CampaignResponseDto - The sanitized campaign data for API responses
 *
 * Note: Uses Zod schema for runtime validation to ensure
 * the response always matches the expected contract
 */
export function mapToCampaignDto(
  campaign: Campaign,
  players: CampaignPlayerDto[] = []
): CampaignResponseDto {
  // Find the GM from the players list
  const gameMaster = players.find(p => p.role === CampaignRole.GM);

  // Parse through Zod schema for runtime validation
  return campaignResponseSchema.parse({
    id: campaign.id,
    name: campaign.name,
    description: campaign.description ?? undefined,
    status: campaign.status,
    gameMaster: gameMaster
      ? {
          userId: gameMaster.userId,
          username: gameMaster.username,
          email: gameMaster.email,
        }
      : undefined,
    createdAt: campaign.createdAt,
    updatedAt: campaign.updatedAt,
    players: players.length > 0 ? players : undefined,
  });
}
