import { Request, Response } from 'express';
import raceService from './race.service';
import { mapToRaceDto, CreateRaceDto, UpdateRaceDto } from './race.model';
import { formatSuccess, formatError } from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class RaceController {
  /**
   * Get all races with optional filtering and pagination
   */
  async getAllRaces(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string,
      );

      // Get races from service
      const options: { skip: number; take: number; ids?: number[] } = { skip, take };
      if (ids) options.ids = ids;
      const { races, count } = await raceService.getAllRaces(options);

      // Map to DTOs
      const raceDtos = races.map((r) => mapToRaceDto(r));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(raceDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        }),
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve races'));
    }
  }

  /**
   * Get race by ID
   */
  async getRaceById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      // Get race
      const race = await raceService.getRaceById(id);

      res.status(200).json(formatSuccess(mapToRaceDto(race)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve race'));
      }
    }
  }

  /**
   * Create a new race
   */
  async createRace(req: Request, res: Response): Promise<void> {
    try {
      const raceData: CreateRaceDto = req.body;

      // Validate request body
      if (!raceData.name) {
        throw new ApiError(400, 'Race name is required');
      }

      const newRace = await raceService.createRace(raceData);
      res.status(201).json(formatSuccess(mapToRaceDto(newRace)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create race'));
      }
    }
  }

  /**
   * Update a race
   */
  async updateRace(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const raceData: UpdateRaceDto = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      const updatedRace = await raceService.updateRace(id, raceData);
      res.status(200).json(formatSuccess(mapToRaceDto(updatedRace)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update race'));
      }
    }
  }

  /**
   * Delete a race
   */
  async deleteRace(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await raceService.deleteRace(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete race'));
      }
    }
  }
}

export default new RaceController();
