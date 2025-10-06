import { Ancestry as PrismaAncestry } from '@prisma/client';
import {
  CreateAncestryDto,
  UpdateAncestryDto,
  AncestryResponseDto,
  ancestryResponseSchema,
} from '@galipette/shared';

// ============================================
// DOMAIN MODEL (Internal Backend Type)
// ============================================

/**
 * Ancestry domain model (extends Prisma generated type)
 * This is the internal representation used within the backend
 */
export interface Ancestry extends PrismaAncestry {}

// ============================================
// RE-EXPORT SHARED DTOs
// ============================================

/**
 * Re-export DTOs from shared library for convenience
 * These are the types used at API boundaries
 */
export type { CreateAncestryDto, UpdateAncestryDto, AncestryResponseDto };

// ============================================
// MAPPING FUNCTIONS
// ============================================

/**
 * Maps a Prisma Ancestry entity to an AncestryResponseDto
 * This function acts as the boundary between internal database
 * representation and external API representation
 *
 * @param ancestry - The Prisma Ancestry entity from the database
 * @returns AncestryResponseDto - The sanitized ancestry data for API responses
 *
 * Note: Uses Zod schema for runtime validation to ensure
 * the response always matches the expected contract
 */
export function mapToAncestryDto(ancestry: Ancestry): AncestryResponseDto {
  // Parse through Zod schema for runtime validation
  return ancestryResponseSchema.parse({
    id: ancestry.id,
    name: ancestry.name,
    description: ancestry.description ?? undefined,
  });
}
