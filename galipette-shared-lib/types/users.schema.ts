import { z } from 'zod';
import { createPaginatedListSchema } from './common.schema';

// ============================================
// INPUT VALIDATION SCHEMAS (Request DTOs)
// ============================================

/**
 * Schema for creating a new user
 * Used for POST /api/users
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      'Username can only contain letters, numbers, underscores, and hyphens'
    ),
});

/**
 * Schema for updating an existing user
 * Used for PATCH /api/users/:id
 * All fields are optional (partial update)
 */
export const updateUserSchema = createUserSchema.partial();

/**
 * Schema for user ID parameter
 * Used for validating route parameters
 */
export const userIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ============================================
// OUTPUT SCHEMAS (Response DTOs)
// ============================================

/**
 * Schema for user response data
 * Used for API responses
 */
export const userResponseSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  username: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Schema for paginated user list response
 */
export const userListResponseSchema = createPaginatedListSchema(
  userResponseSchema,
  'users'
);

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================

/**
 * Type for creating a new user (input)
 */
export type CreateUserDto = z.infer<typeof createUserSchema>;

/**
 * Type for updating a user (input)
 */
export type UpdateUserDto = z.infer<typeof updateUserSchema>;

/**
 * Type for user response (output)
 */
export type UserResponseDto = z.infer<typeof userResponseSchema>;

/**
 * Type for user ID parameter
 */
export type UserIdParam = z.infer<typeof userIdSchema>;

/**
 * Type for paginated user list response
 */
export type UserListResponseDto = z.infer<typeof userListResponseSchema>;
