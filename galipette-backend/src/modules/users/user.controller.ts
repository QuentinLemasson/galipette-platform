import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  userIdSchema,
} from '@galipette/shared';
import userService from './user.service';
import { mapToUserDto } from './user.model';
import {
  formatSuccess,
  formatError,
  formatZodErrors,
} from '../../utils/responseFormatter';
import {
  parseFieldsParam,
  parseIdsParam,
  parsePaginationParams,
} from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class UserController {
  /**
   * Get all users with optional filtering and pagination
   */
  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      // Get users from service
      const options: { skip: number; take: number; ids?: number[] } = {
        skip,
        take,
      };
      if (ids) options.ids = ids;
      const { users, count } = await userService.getAllUsers(options);

      // Map to DTOs
      const userDtos = users.map(mapToUserDto);

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(userDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        })
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve users'));
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = userIdSchema.parse({ id: req.params.id });

      const fields = parseFieldsParam(req.query.fields as string);
      const user = await userService.getUserById(id, fields);

      if (!user) {
        throw new ApiError(404, 'User not found');
      }

      res.status(200).json(formatSuccess(mapToUserDto(user)));
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json(
            formatError('Invalid ID format', formatZodErrors(error.issues))
          );
      } else if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve user'));
      }
    }
  }

  /**
   * Create a new user
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body with Zod
      const userData = createUserSchema.parse(req.body);

      const newUser = await userService.createUser(userData);
      res.status(201).json(formatSuccess(mapToUserDto(newUser)));
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors nicely
        res
          .status(400)
          .json(
            formatError('Validation failed', formatZodErrors(error.issues))
          );
      } else if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else if (error && typeof error === 'object' && 'message' in error) {
        const msg = String((error as any).message);
        if (msg === 'User with this email already exists') {
          res.status(409).json(formatError(msg));
        } else {
          res.status(500).json(formatError('Failed to create user'));
        }
      } else {
        res.status(500).json(formatError('Failed to create user'));
      }
    }
  }

  /**
   * Update a user
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = userIdSchema.parse({ id: req.params.id });

      // Validate request body with Zod
      const userData = updateUserSchema.parse(req.body);

      const updatedUser = await userService.updateUser(id, userData);
      res.status(200).json(formatSuccess(mapToUserDto(updatedUser)));
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json(
            formatError('Validation failed', formatZodErrors(error.issues))
          );
      } else if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else if (error && typeof error === 'object' && 'message' in error) {
        const msg = String((error as any).message);
        if (msg === 'User not found') {
          res.status(404).json(formatError(msg));
        } else if (msg === 'Email already in use') {
          res.status(409).json(formatError(msg));
        } else {
          res.status(500).json(formatError('Failed to update user'));
        }
      } else {
        res.status(500).json(formatError('Failed to update user'));
      }
    }
  }

  /**
   * Delete a user
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = userIdSchema.parse({ id: req.params.id });

      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json(
            formatError('Invalid ID format', formatZodErrors(error.issues))
          );
      } else if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else if (error && typeof error === 'object' && 'message' in error) {
        const msg = String((error as any).message);
        if (msg === 'User not found') {
          res.status(404).json(formatError(msg));
        } else {
          res.status(500).json(formatError('Failed to delete user'));
        }
      } else {
        res.status(500).json(formatError('Failed to delete user'));
      }
    }
  }
}

export default new UserController();
