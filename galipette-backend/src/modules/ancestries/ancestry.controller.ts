import { Request, Response } from 'express';
import { ZodError } from 'zod';
import {
  createAncestrySchema,
  updateAncestrySchema,
  ancestryIdSchema,
} from '@galipette/shared';
import ancestryService from './ancestry.service';
import { mapToAncestryDto } from './ancestry.model';
import {
  formatSuccess,
  formatError,
  formatZodErrors,
} from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class AncestryController {
  /**
   * Get all ancestries with optional filtering and pagination
   */
  async getAllAncestries(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      // Get ancestries from service
      const options: { skip: number; take: number; ids?: number[] } = {
        skip,
        take,
      };
      if (ids) options.ids = ids;
      const { ancestries, count } =
        await ancestryService.getAllAncestries(options);

      // Map to DTOs
      const ancestryDtos = ancestries.map(a => mapToAncestryDto(a));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(ancestryDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        })
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve ancestries'));
    }
  }

  /**
   * Get ancestry by ID
   */
  async getAncestryById(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = ancestryIdSchema.parse({ id: req.params.id });

      // Get ancestry
      const ancestry = await ancestryService.getAncestryById(id);

      res.status(200).json(formatSuccess(mapToAncestryDto(ancestry)));
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
        res.status(500).json(formatError('Failed to retrieve ancestry'));
      }
    }
  }

  /**
   * Create a new ancestry
   */
  async createAncestry(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body with Zod
      const ancestryData = createAncestrySchema.parse(req.body);

      const newAncestry = await ancestryService.createAncestry(ancestryData);
      res.status(201).json(formatSuccess(mapToAncestryDto(newAncestry)));
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
      } else {
        res.status(500).json(formatError('Failed to create ancestry'));
      }
    }
  }

  /**
   * Update an ancestry
   */
  async updateAncestry(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = ancestryIdSchema.parse({ id: req.params.id });

      // Validate request body with Zod
      const ancestryData = updateAncestrySchema.parse(req.body);

      const updatedAncestry = await ancestryService.updateAncestry(
        id,
        ancestryData
      );
      res.status(200).json(formatSuccess(mapToAncestryDto(updatedAncestry)));
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json(
            formatError('Validation failed', formatZodErrors(error.issues))
          );
      } else if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update ancestry'));
      }
    }
  }

  /**
   * Delete an ancestry
   */
  async deleteAncestry(req: Request, res: Response): Promise<void> {
    try {
      // Validate ID parameter with Zod
      const { id } = ancestryIdSchema.parse({ id: req.params.id });

      await ancestryService.deleteAncestry(id);
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
      } else {
        res.status(500).json(formatError('Failed to delete ancestry'));
      }
    }
  }
}

export default new AncestryController();
