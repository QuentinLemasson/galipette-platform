import { User as PrismaUser } from '@prisma/client';
import {
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto,
  userResponseSchema,
} from '@galipette/shared';

// ============================================
// DOMAIN MODEL (Internal Backend Type)
// ============================================

/**
 * User domain model (extends Prisma generated type)
 * This is the internal representation used within the backend
 */
export interface User extends PrismaUser {}

// ============================================
// RE-EXPORT SHARED DTOs
// ============================================

/**
 * Re-export DTOs from shared library for convenience
 * These are the types used at API boundaries
 */
export type { CreateUserDto, UpdateUserDto, UserResponseDto };

// ============================================
// MAPPING FUNCTIONS
// ============================================

/**
 * Maps a Prisma User entity to a UserResponseDto
 * This function acts as the boundary between internal database
 * representation and external API representation
 *
 * @param user - The Prisma User entity from the database
 * @returns UserResponseDto - The sanitized user data for API responses
 *
 * Note: Uses Zod schema for runtime validation to ensure
 * the response always matches the expected contract
 */
export function mapToUserDto(user: User): UserResponseDto {
  // Parse through Zod schema for runtime validation
  return userResponseSchema.parse({
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
