import apiClient from './api-client';
import {
  type UserResponseDto,
  type CreateUserDto,
  type UpdateUserDto,
  createUserSchema,
  updateUserSchema,
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
 * Users API Service
 */
export const usersService = {
  /**
   * Get all users with pagination
   */
  async getAll(params?: {
    page?: number;
    limit?: number;
  }): Promise<{ users: UserResponseDto[]; meta: any }> {
    const response = await apiClient.get<ApiSuccessResponse<UserResponseDto[]>>(
      '/users',
      { params }
    );
    return {
      users: response.data.data,
      meta: response.data.meta,
    };
  },

  /**
   * Get a single user by ID
   */
  async getById(id: number): Promise<UserResponseDto> {
    const response = await apiClient.get<ApiSuccessResponse<UserResponseDto>>(
      `/users/${id}`
    );
    return response.data.data;
  },

  /**
   * Create a new user
   * Validates input with Zod before sending
   */
  async create(userData: CreateUserDto): Promise<UserResponseDto> {
    // Client-side validation
    const validated = createUserSchema.parse(userData);

    const response = await apiClient.post<ApiSuccessResponse<UserResponseDto>>(
      '/users',
      validated
    );
    return response.data.data;
  },

  /**
   * Update an existing user
   * Validates input with Zod before sending
   */
  async update(id: number, userData: UpdateUserDto): Promise<UserResponseDto> {
    // Client-side validation
    const validated = updateUserSchema.parse(userData);

    const response = await apiClient.patch<ApiSuccessResponse<UserResponseDto>>(
      `/users/${id}`,
      validated
    );
    return response.data.data;
  },

  /**
   * Delete a user
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};

export default usersService;
