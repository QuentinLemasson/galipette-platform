import { Request, Response } from 'express';
import campaignService from './campaign.service';
import {
  mapToCampaignDto,
  CreateCampaignDto,
  UpdateCampaignDto,
  AddPlayerToCampaignDto,
} from './campaign.model';
import { formatSuccess, formatError } from '../../utils/responseFormatter';
import { parseIdsParam, parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class CampaignController {
  /**
   * Get all campaigns with optional filtering and pagination
   */
  async getAllCampaigns(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const playerId = req.query.playerId
        ? parseInt(req.query.playerId as string)
        : undefined;
      const ids = parseIdsParam(req.query.ids as string);
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string
      );

      // Get campaigns from service
      const { campaigns, count } = await campaignService.getAllCampaigns({
        ...(playerId !== undefined ? { playerId } : {}),
        ...(ids !== undefined ? { ids } : {}),
        skip,
        take,
      });

      // Map to DTOs with players (to include GM info)
      const campaignDtos = await Promise.all(
        campaigns.map(async c => {
          const players = await campaignService.getCampaignPlayers(c.id);
          return mapToCampaignDto(c, players);
        })
      );

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(campaignDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        })
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve campaigns'));
    }
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      // Get campaign
      const campaign = await campaignService.getCampaignById(id);

      // Always get players to include GM info
      const players = await campaignService.getCampaignPlayers(id);

      res.status(200).json(formatSuccess(mapToCampaignDto(campaign, players)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve campaign'));
      }
    }
  }

  /**
   * Get all players in a campaign
   */
  async getCampaignPlayers(req: Request, res: Response): Promise<void> {
    try {
      const campaignId = parseInt(req.params.id);

      if (isNaN(campaignId)) {
        throw new ApiError(400, 'Invalid campaign ID format');
      }

      const players = await campaignService.getCampaignPlayers(campaignId);
      res.status(200).json(formatSuccess(players));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res
          .status(500)
          .json(formatError('Failed to retrieve campaign players'));
      }
    }
  }

  /**
   * Create a new campaign
   */
  async createCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaignData: CreateCampaignDto = req.body;

      // Validate request body
      if (!campaignData.name || !campaignData.ownerId) {
        throw new ApiError(400, 'Name and ownerId are required');
      }

      const newCampaign = await campaignService.createCampaign(campaignData);
      res.status(201).json(formatSuccess(mapToCampaignDto(newCampaign)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create campaign'));
      }
    }
  }

  /**
   * Update a campaign
   */
  async updateCampaign(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const campaignData: UpdateCampaignDto = req.body;

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      const updatedCampaign = await campaignService.updateCampaign(
        id,
        campaignData
      );
      res.status(200).json(formatSuccess(mapToCampaignDto(updatedCampaign)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update campaign'));
      }
    }
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await campaignService.deleteCampaign(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete campaign'));
      }
    }
  }

  /**
   * Add a player to a campaign
   */
  async addPlayerToCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaignId = parseInt(req.params.id);
      const playerData: AddPlayerToCampaignDto = req.body;

      if (isNaN(campaignId)) {
        throw new ApiError(400, 'Invalid campaign ID format');
      }

      if (!playerData.userId || !playerData.role) {
        throw new ApiError(400, 'User ID and role are required');
      }

      await campaignService.addPlayerToCampaign(campaignId, playerData);
      res
        .status(201)
        .json(formatSuccess({ message: 'Player added to campaign' }));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to add player to campaign'));
      }
    }
  }

  /**
   * Remove a player from a campaign
   */
  async removePlayerFromCampaign(req: Request, res: Response): Promise<void> {
    try {
      const campaignId = parseInt(req.params.id);
      const playerId = parseInt(req.params.playerId);

      if (isNaN(campaignId) || isNaN(playerId)) {
        throw new ApiError(400, 'Invalid ID format');
      }

      await campaignService.removePlayerFromCampaign(campaignId, playerId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res
          .status(500)
          .json(formatError('Failed to remove player from campaign'));
      }
    }
  }
}

export default new CampaignController();
