import apiClient from '@/common/services/api-client';
import {
  type CampaignResponseDto,
  type CampaignPlayerDto,
  type CreateCampaignDto,
  type UpdateCampaignDto,
  type AddPlayerToCampaignDto,
  createCampaignSchema,
  updateCampaignSchema,
  addPlayerToCampaignSchema,
} from '@galipette/shared';

/**
 * API Success Response format
 */
interface ApiSuccessResponse<T> {
  status: 'success';
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Campaigns API Service
 */
export const campaignsService = {
  /**
   * Get all campaigns with optional filtering
   */
  async getAll(params?: {
    playerId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ campaigns: CampaignResponseDto[]; meta: any }> {
    const response = await apiClient.get<
      ApiSuccessResponse<CampaignResponseDto[]>
    >('/campaigns', { params });
    return {
      campaigns: response.data.data,
      meta: response.data.meta,
    };
  },

  /**
   * Get a single campaign by ID
   */
  async getById(id: number): Promise<CampaignResponseDto> {
    const response = await apiClient.get<
      ApiSuccessResponse<CampaignResponseDto>
    >(`/campaigns/${id}`);
    return response.data.data;
  },

  /**
   * Get players in a campaign
   */
  async getPlayers(campaignId: number): Promise<CampaignPlayerDto[]> {
    const response = await apiClient.get<
      ApiSuccessResponse<CampaignPlayerDto[]>
    >(`/campaigns/${campaignId}/players`);
    return response.data.data;
  },

  /**
   * Create a new campaign
   * Validates input with Zod before sending
   */
  async create(campaignData: CreateCampaignDto): Promise<CampaignResponseDto> {
    // Client-side validation
    const validated = createCampaignSchema.parse(campaignData);

    const response = await apiClient.post<
      ApiSuccessResponse<CampaignResponseDto>
    >('/campaigns', validated);
    return response.data.data;
  },

  /**
   * Update an existing campaign
   * Validates input with Zod before sending
   */
  async update(
    id: number,
    campaignData: UpdateCampaignDto
  ): Promise<CampaignResponseDto> {
    // Client-side validation
    const validated = updateCampaignSchema.parse(campaignData);

    const response = await apiClient.patch<
      ApiSuccessResponse<CampaignResponseDto>
    >(`/campaigns/${id}`, validated);
    return response.data.data;
  },

  /**
   * Delete a campaign
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/campaigns/${id}`);
  },

  /**
   * Add a player to a campaign
   */
  async addPlayer(
    campaignId: number,
    playerData: AddPlayerToCampaignDto
  ): Promise<void> {
    // Client-side validation
    const validated = addPlayerToCampaignSchema.parse(playerData);

    await apiClient.post(`/campaigns/${campaignId}/players`, validated);
  },

  /**
   * Remove a player from a campaign
   */
  async removePlayer(campaignId: number, userId: number): Promise<void> {
    await apiClient.delete(`/campaigns/${campaignId}/players/${userId}`);
  },
};

export default campaignsService;
