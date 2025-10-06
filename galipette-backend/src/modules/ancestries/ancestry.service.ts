import {
  Ancestry,
  CreateAncestryDto,
  UpdateAncestryDto,
} from './ancestry.model';
import ancestryRepository from './ancestry.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllAncestriesOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

class AncestryService {
  /**
   * Get all ancestries with filtering
   */
  async getAllAncestries(
    options?: GetAllAncestriesOptions
  ): Promise<{ ancestries: Ancestry[]; count: number }> {
    return ancestryRepository.findAll(options);
  }

  /**
   * Get ancestry by ID
   */
  async getAncestryById(id: number): Promise<Ancestry> {
    const ancestry = await ancestryRepository.findById(id);

    if (!ancestry) {
      throw new ApiError(404, 'Ancestry not found');
    }

    return ancestry;
  }

  /**
   * Create a new ancestry
   */
  async createAncestry(data: CreateAncestryDto): Promise<Ancestry> {
    // Check if ancestry with this name already exists
    const existingAncestry = await ancestryRepository.findByName(data.name);

    if (existingAncestry) {
      throw new ApiError(409, 'Ancestry with this name already exists');
    }

    return ancestryRepository.create(data);
  }

  /**
   * Update an ancestry
   */
  async updateAncestry(id: number, data: UpdateAncestryDto): Promise<Ancestry> {
    // Check if ancestry exists
    const ancestry = await ancestryRepository.findById(id);

    if (!ancestry) {
      throw new ApiError(404, 'Ancestry not found');
    }

    // Check if name is being updated and if it's already in use
    if (data.name && data.name !== ancestry.name) {
      const nameExists = await ancestryRepository.findByName(data.name);

      if (nameExists) {
        throw new ApiError(409, 'Ancestry with this name already exists');
      }
    }

    return ancestryRepository.update(id, data);
  }

  /**
   * Delete an ancestry
   */
  async deleteAncestry(id: number): Promise<Ancestry> {
    // Check if ancestry exists
    const ancestry = await ancestryRepository.findById(id);

    if (!ancestry) {
      throw new ApiError(404, 'Ancestry not found');
    }

    try {
      return ancestryRepository.delete(id);
    } catch (error: any) {
      // Check if there's a foreign key constraint error
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code === 'P2003'
      ) {
        throw new ApiError(
          409,
          'Cannot delete ancestry that is still in use by characters'
        );
      }

      throw error;
    }
  }
}

export default new AncestryService();
