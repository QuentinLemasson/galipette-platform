import apiClient from '@/common/services/api-client';
import {
  type AncestryResponseDto,
  type CreateAncestryDto,
  type UpdateAncestryDto,
  createAncestrySchema,
  updateAncestrySchema,
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
 * Ancestries API Service
 */
export const ancestriesService = {
  /**
   * Get all ancestries with optional filtering
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ ancestries: AncestryResponseDto[]; meta: any }> {
    const response = await apiClient.get<
      ApiSuccessResponse<AncestryResponseDto[]>
    >('/ancestries', { params });
    return {
      ancestries: response.data.data,
      meta: response.data.meta,
    };
  },

  /**
   * Get a single ancestry by ID
   */
  async getById(id: number): Promise<AncestryResponseDto> {
    const response = await apiClient.get<
      ApiSuccessResponse<AncestryResponseDto>
    >(`/ancestries/${id}`);
    return response.data.data;
  },

  /**
   * Create a new ancestry
   * Validates input with Zod before sending
   */
  async create(ancestryData: CreateAncestryDto): Promise<AncestryResponseDto> {
    // Client-side validation
    const validated = createAncestrySchema.parse(ancestryData);

    const response = await apiClient.post<
      ApiSuccessResponse<AncestryResponseDto>
    >('/ancestries', validated);
    return response.data.data;
  },

  /**
   * Update an existing ancestry
   * Validates input with Zod before sending
   */
  async update(
    id: number,
    ancestryData: UpdateAncestryDto
  ): Promise<AncestryResponseDto> {
    // Client-side validation
    const validated = updateAncestrySchema.parse(ancestryData);

    const response = await apiClient.patch<
      ApiSuccessResponse<AncestryResponseDto>
    >(`/ancestries/${id}`, validated);
    return response.data.data;
  },

  /**
   * Delete an ancestry
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/ancestries/${id}`);
  },
};

export default ancestriesService;
