import { Race, CreateRaceDto, UpdateRaceDto } from './race.model';
import raceRepository from './race.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllRacesOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

class RaceService {
  /**
   * Get all races with filtering
   */
  async getAllRaces(options?: GetAllRacesOptions): Promise<{ races: Race[]; count: number }> {
    return raceRepository.findAll(options);
  }

  /**
   * Get race by ID
   */
  async getRaceById(id: number): Promise<Race> {
    const race = await raceRepository.findById(id);

    if (!race) {
      throw new ApiError(404, 'Race not found');
    }

    return race;
  }

  /**
   * Create a new race
   */
  async createRace(data: CreateRaceDto): Promise<Race> {
    // Check if race with this name already exists
    const existingRace = await raceRepository.findByName(data.name);

    if (existingRace) {
      throw new ApiError(409, 'Race with this name already exists');
    }

    return raceRepository.create(data);
  }

  /**
   * Update a race
   */
  async updateRace(id: number, data: UpdateRaceDto): Promise<Race> {
    // Check if race exists
    const race = await raceRepository.findById(id);

    if (!race) {
      throw new ApiError(404, 'Race not found');
    }

    // Check if name is being updated and if it's already in use
    if (data.name && data.name !== race.name) {
      const nameExists = await raceRepository.findByName(data.name);

      if (nameExists) {
        throw new ApiError(409, 'Race with this name already exists');
      }
    }

    return raceRepository.update(id, data);
  }

  /**
   * Delete a race
   */
  async deleteRace(id: number): Promise<Race> {
    // Check if race exists
    const race = await raceRepository.findById(id);

    if (!race) {
      throw new ApiError(404, 'Race not found');
    }

    try {
      return raceRepository.delete(id);
    } catch (error: any) {
      // Check if there's a foreign key constraint error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
        throw new ApiError(409, 'Cannot delete race that is still in use by characters');
      }

      throw error;
    }
  }
}

export default new RaceService();
