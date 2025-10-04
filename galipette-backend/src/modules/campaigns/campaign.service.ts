import {
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignPlayerDto,
  AddPlayerToCampaignDto,
} from './campaign.model';
import campaignRepository from './campaign.repository';
import userRepository from '../users/user.repository';
import { ApiError } from '../../middleware/errorHandler';
import { CampaignRole } from '@prisma/client';

interface GetAllCampaignsOptions {
  playerId?: number;
  ids?: number[];
  skip?: number;
  take?: number;
}

class CampaignService {
  /**
   * Get all campaigns with filtering
   */
  async getAllCampaigns(
    options?: GetAllCampaignsOptions,
  ): Promise<{ campaigns: Campaign[]; count: number }> {
    return campaignRepository.findAll(options);
  }

  /**
   * Get campaign by ID
   */
  async getCampaignById(id: number, includePlayers = false): Promise<Campaign> {
    const campaign = await campaignRepository.findById(id, includePlayers);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    return campaign;
  }

  /**
   * Get players for a campaign
   */
  async getCampaignPlayers(campaignId: number): Promise<CampaignPlayerDto[]> {
    // Check if campaign exists
    const campaign = await campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    return campaignRepository.getCampaignPlayers(campaignId);
  }

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignDto): Promise<Campaign> {
    // Check if owner exists
    const owner = await userRepository.findById(data.ownerId);
    if (!owner) {
      throw new ApiError(404, 'Owner user not found');
    }

    return campaignRepository.create(data);
  }

  /**
   * Update a campaign
   */
  async updateCampaign(id: number, data: UpdateCampaignDto): Promise<Campaign> {
    // Check if campaign exists
    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    return campaignRepository.update(id, data);
  }

  /**
   * Delete a campaign
   */
  async deleteCampaign(id: number): Promise<Campaign> {
    // Check if campaign exists
    const campaign = await campaignRepository.findById(id);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    return campaignRepository.delete(id);
  }

  /**
   * Add a player to a campaign
   */
  async addPlayerToCampaign(campaignId: number, data: AddPlayerToCampaignDto): Promise<void> {
    // Check if campaign exists
    const campaign = await campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Check if user exists
    const user = await userRepository.findById(data.userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if user is already in the campaign
    const isUserInCampaign = await campaignRepository.isUserInCampaign(campaignId, data.userId);

    if (isUserInCampaign) {
      throw new ApiError(409, 'User is already in the campaign');
    }

    await campaignRepository.addPlayer(campaignId, data.userId, data.role);
  }

  /**
   * Remove a player from a campaign
   */
  async removePlayerFromCampaign(campaignId: number, userId: number): Promise<void> {
    // Check if campaign exists
    const campaign = await campaignRepository.findById(campaignId);

    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Check if user exists in campaign
    const isUserInCampaign = await campaignRepository.isUserInCampaign(campaignId, userId);

    if (!isUserInCampaign) {
      throw new ApiError(404, 'User is not in the campaign');
    }

    // Check if user is the only GM
    const userRole = await campaignRepository.getUserRole(campaignId, userId);

    if (userRole === CampaignRole.GM) {
      const players = await campaignRepository.getCampaignPlayers(campaignId);
      const gmCount = players.filter((p) => p.role === CampaignRole.GM).length;

      if (gmCount <= 1) {
        throw new ApiError(400, 'Cannot remove the only GM from a campaign');
      }
    }

    await campaignRepository.removePlayer(campaignId, userId);
  }
}

export default new CampaignService();
