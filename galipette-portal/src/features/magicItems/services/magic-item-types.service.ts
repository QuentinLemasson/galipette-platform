/**
 * @fileOverview Service for the /api/magic-item-types REST endpoints.
 */
import apiClient from '@/common/services/api-client';
import {
  type MagicItemTypeResponseDto,
  type CreateMagicItemTypeDto,
  type UpdateMagicItemTypeDto,
  createMagicItemTypeSchema,
  updateMagicItemTypeSchema,
} from '@galipette/shared';

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

export const magicItemTypesService = {
  async getAll(): Promise<MagicItemTypeResponseDto[]> {
    const response = await apiClient.get<
      ApiSuccessResponse<MagicItemTypeResponseDto[]>
    >('/magic-item-types', { params: { limit: 100 } });
    return response.data.data;
  },

  async getById(id: number): Promise<MagicItemTypeResponseDto> {
    const response = await apiClient.get<
      ApiSuccessResponse<MagicItemTypeResponseDto>
    >(`/magic-item-types/${id}`);
    return response.data.data;
  },

  async create(
    data: CreateMagicItemTypeDto
  ): Promise<MagicItemTypeResponseDto> {
    const validated = createMagicItemTypeSchema.parse(data);
    const response = await apiClient.post<
      ApiSuccessResponse<MagicItemTypeResponseDto>
    >('/magic-item-types', validated);
    return response.data.data;
  },

  async update(
    id: number,
    data: UpdateMagicItemTypeDto
  ): Promise<MagicItemTypeResponseDto> {
    const validated = updateMagicItemTypeSchema.parse(data);
    const response = await apiClient.patch<
      ApiSuccessResponse<MagicItemTypeResponseDto>
    >(`/magic-item-types/${id}`, validated);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/magic-item-types/${id}`);
  },
};

export default magicItemTypesService;
