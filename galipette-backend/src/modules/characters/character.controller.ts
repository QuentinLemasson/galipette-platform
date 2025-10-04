import { Request, Response } from 'express';
import characterService from './character.service';
import {
  mapToCharacterDto,
  CreateCharacterDto,
  UpdateCharacterDto,
  UpdateCharacterAttributesDto,
} from './character.model';
import { formatSuccess, formatError } from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';
import { AttributeType } from '@prisma/client';

export class CharacterController {
  /**
   * Get all characters with optional filtering and pagination
   */
  async getAllCharacters(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const campaignId = req.query.campaignId
        ? parseInt(req.query.campaignId as string)
        : undefined;
      const playerId = req.query.playerId ? parseInt(req.query.playerId as string) : undefined;
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string,
      );

      // Get characters from service
      const options: {
        skip: number;
        take: number;
        campaignId?: number;
        playerId?: number;
        ids?: number[];
      } = { skip, take };
      if (campaignId !== undefined) options.campaignId = campaignId;
      if (playerId !== undefined) options.playerId = playerId;
      if (ids) options.ids = ids;
      const { characters, count } = await characterService.getAllCharacters(options);

      // Map to DTOs
      const characterDtos = characters.map((c) => mapToCharacterDto(c));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(characterDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        }),
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve characters'));
    }
  }

  /**
   * Get character by ID
   */
  async getCharacterById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      // Determine if we should include details
      const includeDetails = req.query.includeDetails === 'true';

      // Get character
      const character = await characterService.getCharacterById(id, includeDetails);

      res.status(200).json(formatSuccess(mapToCharacterDto(character)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve character'));
      }
    }
  }

  /**
   * Create a new character
   */
  async createCharacter(req: Request, res: Response): Promise<void> {
    try {
      const characterData: CreateCharacterDto = req.body;

      // Validate request body
      if (
        !characterData.name ||
        !characterData.raceId ||
        !characterData.userId ||
        !characterData.campaignId ||
        characterData.hitPoints === undefined ||
        characterData.maxHitPoints === undefined
      ) {
        throw new ApiError(400, 'Missing required character data');
      }

      const newCharacter = await characterService.createCharacter(characterData);
      res.status(201).json(formatSuccess(mapToCharacterDto(newCharacter)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create character'));
      }
    }
  }

  /**
   * Update a character
   */
  async updateCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const characterData: UpdateCharacterDto = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      const updatedCharacter = await characterService.updateCharacter(id, characterData);
      res.status(200).json(formatSuccess(mapToCharacterDto(updatedCharacter)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update character'));
      }
    }
  }

  /**
   * Delete a character
   */
  async deleteCharacter(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await characterService.deleteCharacter(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete character'));
      }
    }
  }

  /**
   * Update character attributes
   */
  async updateCharacterAttributes(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const attributesData: UpdateCharacterAttributesDto = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      const updatedAttributes = await characterService.updateCharacterAttributes(
        id,
        attributesData,
      );
      res.status(200).json(formatSuccess(updatedAttributes));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update character attributes'));
      }
    }
  }

  /**
   * Update a single character attribute
   */
  async updateCharacterAttribute(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const attrType = req.params.attrType as AttributeType;
      const { value } = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      if (value === undefined || typeof value !== 'number') {
        throw new ApiError(400, 'Attribute value must be a number');
      }

      const updatedAttribute = await characterService.updateCharacterAttribute(id, attrType, value);
      res.status(200).json(formatSuccess(updatedAttribute));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update character attribute'));
      }
    }
  }
}

export default new CharacterController();
