import { Request, Response } from 'express';
import afflictionService from './affliction.service';
import {
  mapToAfflictionDto,
  mapToTagDto,
  mapToCharacterAfflictionDto,
  CreateAfflictionDto,
  UpdateAfflictionDto,
  CreateTagDto,
  CharacterAfflictionDto,
} from './affliction.model';
import { formatSuccess, formatError } from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class AfflictionController {
  /**
   * Get all afflictions with optional filtering and pagination
   */
  async getAllAfflictions(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const ids = parseIdsParam(req.query.ids as string);
      const tagIds = parseIdsParam(req.query.tagIds as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string,
      );

      // Get afflictions from service
      const options: { skip: number; take: number; ids?: number[]; tagIds?: number[] } = {
        skip,
        take,
      };
      if (ids) options.ids = ids;
      if (tagIds) options.tagIds = tagIds;
      const { afflictions, count } = await afflictionService.getAllAfflictions(options);

      // Map to DTOs
      const afflictionDtos = afflictions.map((a) => mapToAfflictionDto(a));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(afflictionDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        }),
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve afflictions'));
    }
  }

  /**
   * Get affliction by ID
   */
  async getAfflictionById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      // Get affliction
      const affliction = await afflictionService.getAfflictionById(id);

      res.status(200).json(formatSuccess(mapToAfflictionDto(affliction)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve affliction'));
      }
    }
  }

  /**
   * Create a new affliction
   */
  async createAffliction(req: Request, res: Response): Promise<void> {
    try {
      const afflictionData: CreateAfflictionDto = req.body;

      // Validate request body
      if (!afflictionData.name || !afflictionData.description) {
        throw new ApiError(400, 'Name and description are required');
      }

      const newAffliction = await afflictionService.createAffliction(afflictionData);
      res.status(201).json(formatSuccess(mapToAfflictionDto(newAffliction)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create affliction'));
      }
    }
  }

  /**
   * Update an affliction
   */
  async updateAffliction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const afflictionData: UpdateAfflictionDto = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      const updatedAffliction = await afflictionService.updateAffliction(id, afflictionData);
      res.status(200).json(formatSuccess(mapToAfflictionDto(updatedAffliction)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update affliction'));
      }
    }
  }

  /**
   * Delete an affliction
   */
  async deleteAffliction(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await afflictionService.deleteAffliction(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete affliction'));
      }
    }
  }

  /**
   * Get all tags with optional filtering and pagination
   */
  async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string,
      );

      // Get tags from service
      const options: { skip: number; take: number; ids?: number[] } = { skip, take };
      if (ids) options.ids = ids;
      const { tags, count } = await afflictionService.getAllTags(options);

      // Map to DTOs
      const tagDtos = tags.map((t) => mapToTagDto(t));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(tagDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        }),
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve tags'));
    }
  }

  /**
   * Get tag by ID
   */
  async getTagById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      // Get tag
      const tag = await afflictionService.getTagById(id);

      res.status(200).json(formatSuccess(mapToTagDto(tag)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve tag'));
      }
    }
  }

  /**
   * Create a new tag
   */
  async createTag(req: Request, res: Response): Promise<void> {
    try {
      const tagData: CreateTagDto = req.body;

      // Validate request body
      if (!tagData.name) {
        throw new ApiError(400, 'Tag name is required');
      }

      const newTag = await afflictionService.createTag(tagData);
      res.status(201).json(formatSuccess(mapToTagDto(newTag)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create tag'));
      }
    }
  }

  /**
   * Delete a tag
   */
  async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await afflictionService.deleteTag(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete tag'));
      }
    }
  }

  /**
   * Get afflictions for a character
   */
  async getCharacterAfflictions(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.id);

      if (isNaN(characterId)) {
        throw new ApiError(400, 'Invalid character ID format');
      }

      const afflictions = await afflictionService.getCharacterAfflictions(characterId);
      const afflictionDtos = afflictions.map((a) => mapToCharacterAfflictionDto(a));

      res.status(200).json(formatSuccess(afflictionDtos));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve character afflictions'));
      }
    }
  }

  /**
   * Apply an affliction to a character
   */
  async applyAfflictionToCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.id);
      const afflictionData: CharacterAfflictionDto = req.body;

      if (isNaN(characterId)) {
        throw new ApiError(400, 'Invalid character ID format');
      }

      if (!afflictionData.afflictionId || afflictionData.severity === undefined) {
        throw new ApiError(400, 'Affliction ID and severity are required');
      }

      const charAffliction = await afflictionService.applyAfflictionToCharacter(
        characterId,
        afflictionData,
      );
      res.status(201).json(formatSuccess(mapToCharacterAfflictionDto(charAffliction)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to apply affliction to character'));
      }
    }
  }

  /**
   * Update severity of a character's affliction
   */
  async updateCharacterAffliction(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.id);
      const afflictionId = parseInt(req.params.afflictionId);
      const { severity } = req.body;

      if (isNaN(characterId) || isNaN(afflictionId)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      if (severity === undefined) {
        throw new ApiError(400, 'Severity is required');
      }

      const charAffliction = await afflictionService.updateCharacterAffliction(
        characterId,
        afflictionId,
        severity,
      );

      res.status(200).json(formatSuccess(mapToCharacterAfflictionDto(charAffliction)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update character affliction'));
      }
    }
  }

  /**
   * Remove an affliction from a character
   */
  async removeAfflictionFromCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterId = parseInt(req.params.id);
      const afflictionId = parseInt(req.params.afflictionId);

      if (isNaN(characterId) || isNaN(afflictionId)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await afflictionService.removeAfflictionFromCharacter(characterId, afflictionId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to remove affliction from character'));
      }
    }
  }
}

export default new AfflictionController();
