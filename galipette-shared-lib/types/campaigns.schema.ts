import { z } from 'zod';

// ============================================
// ENUMS
// ============================================

/**
 * Campaign status enum
 */
export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  ENDED = 'ENDED',
}

/**
 * Campaign role enum
 */
export enum CampaignRole {
  PLAYER = 'PLAYER',
  GM = 'GM',
}

// ============================================
// INPUT VALIDATION SCHEMAS (Request DTOs)
// ============================================

/**
 * Schema for creating a new campaign
 * Used for POST /api/campaigns
 */
export const createCampaignSchema = z.object({
  name: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must not exceed 100 characters'),
  description: z.string().optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
  ownerId: z.number().int().positive('Owner ID must be a positive integer'),
});

/**
 * Schema for updating an existing campaign
 * Used for PATCH /api/campaigns/:id
 * All fields are optional (partial update)
 */
export const updateCampaignSchema = z.object({
  name: z
    .string()
    .min(3, 'Campaign name must be at least 3 characters')
    .max(100, 'Campaign name must not exceed 100 characters')
    .optional(),
  description: z.string().optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
});

/**
 * Schema for adding a player to a campaign
 * Used for POST /api/campaigns/:id/players
 */
export const addPlayerToCampaignSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  role: z.nativeEnum(CampaignRole),
});

/**
 * Schema for campaign ID parameter
 * Used for validating route parameters
 */
export const campaignIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ============================================
// OUTPUT SCHEMAS (Response DTOs)
// ============================================

/**
 * Schema for Game Master info in campaign response
 */
export const gameMasterSchema = z.object({
  userId: z.number().int(),
  username: z.string(),
  email: z.string().email(),
});

/**
 * Schema for campaign player data
 */
export const campaignPlayerSchema = z.object({
  userId: z.number().int(),
  username: z.string(),
  email: z.string().email(),
  role: z.nativeEnum(CampaignRole),
});

/**
 * Schema for campaign response data
 * Used for API responses
 */
export const campaignResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  description: z.string().optional(),
  status: z.nativeEnum(CampaignStatus),
  gameMaster: gameMasterSchema.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  players: z.array(campaignPlayerSchema).optional(),
});

/**
 * Schema for paginated campaign list response
 */
export const campaignListResponseSchema = z.object({
  campaigns: z.array(campaignResponseSchema),
  pagination: z.object({
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative(),
  }),
});

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================

/**
 * Type for creating a new campaign (input)
 */
export type CreateCampaignDto = z.infer<typeof createCampaignSchema>;

/**
 * Type for updating a campaign (input)
 */
export type UpdateCampaignDto = z.infer<typeof updateCampaignSchema>;

/**
 * Type for adding a player to a campaign (input)
 */
export type AddPlayerToCampaignDto = z.infer<typeof addPlayerToCampaignSchema>;

/**
 * Type for campaign ID parameter
 */
export type CampaignIdParam = z.infer<typeof campaignIdSchema>;

/**
 * Type for Game Master info
 */
export type GameMasterDto = z.infer<typeof gameMasterSchema>;

/**
 * Type for campaign player data
 */
export type CampaignPlayerDto = z.infer<typeof campaignPlayerSchema>;

/**
 * Type for campaign response (output)
 */
export type CampaignResponseDto = z.infer<typeof campaignResponseSchema>;

/**
 * Type for paginated campaign list response
 */
export type CampaignListResponseDto = z.infer<
  typeof campaignListResponseSchema
>;
