import {
  Affliction,
  Tag,
  CharacterAffliction,
  CreateAfflictionDto,
  UpdateAfflictionDto,
  CreateTagDto,
  CharacterAfflictionDto,
} from './affliction.model';
import afflictionRepository from './affliction.repository';
import characterRepository from '../characters/character.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllAfflictionsOptions {
  ids?: number[];
  tagIds?: number[];
  skip?: number;
  take?: number;
}

interface GetAllTagsOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

type CharacterAfflictionWithAffliction = CharacterAffliction & {
  affliction: Affliction & { tags?: { tag: Tag }[] };
};

class AfflictionService {
  /**
   * Get all afflictions with filtering
   */
  async getAllAfflictions(
    options?: GetAllAfflictionsOptions,
  ): Promise<{ afflictions: Affliction[]; count: number }> {
    return afflictionRepository.findAllAfflictions(options);
  }

  /**
   * Get affliction by ID
   */
  async getAfflictionById(id: number): Promise<Affliction> {
    const affliction = await afflictionRepository.findAfflictionById(id);

    if (!affliction) {
      throw new ApiError(404, 'Affliction not found');
    }

    return affliction;
  }

  /**
   * Create a new affliction
   */
  async createAffliction(data: CreateAfflictionDto): Promise<Affliction> {
    // Check if affliction with this name already exists
    const existingAffliction = await afflictionRepository.findAfflictionByName(data.name);

    if (existingAffliction) {
      throw new ApiError(409, 'Affliction with this name already exists');
    }

    // Validate tags if provided
    if (data.tagIds && data.tagIds.length > 0) {
      for (const tagId of data.tagIds) {
        const tag = await afflictionRepository.findTagById(tagId);

        if (!tag) {
          throw new ApiError(404, `Tag with ID ${tagId} not found`);
        }
      }
    }

    return afflictionRepository.createAffliction(data);
  }

  /**
   * Update an affliction
   */
  async updateAffliction(id: number, data: UpdateAfflictionDto): Promise<Affliction> {
    // Check if affliction exists
    const affliction = await afflictionRepository.findAfflictionById(id);

    if (!affliction) {
      throw new ApiError(404, 'Affliction not found');
    }

    // Check if name is being updated and if it's already in use
    if (data.name && data.name !== affliction.name) {
      const nameExists = await afflictionRepository.findAfflictionByName(data.name);

      if (nameExists) {
        throw new ApiError(409, 'Affliction with this name already exists');
      }
    }

    // Validate tags if provided
    if (data.tagIds && data.tagIds.length > 0) {
      for (const tagId of data.tagIds) {
        const tag = await afflictionRepository.findTagById(tagId);

        if (!tag) {
          throw new ApiError(404, `Tag with ID ${tagId} not found`);
        }
      }
    }

    return afflictionRepository.updateAffliction(id, data);
  }

  /**
   * Delete an affliction
   */
  async deleteAffliction(id: number): Promise<Affliction> {
    // Check if affliction exists
    const affliction = await afflictionRepository.findAfflictionById(id);

    if (!affliction) {
      throw new ApiError(404, 'Affliction not found');
    }

    try {
      return afflictionRepository.deleteAffliction(id);
    } catch (error) {
      // Check if there's a foreign key constraint error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
        throw new ApiError(409, 'Cannot delete affliction that is still in use by characters');
      }

      throw error;
    }
  }

  /**
   * Get all tags with filtering
   */
  async getAllTags(options?: GetAllTagsOptions): Promise<{ tags: Tag[]; count: number }> {
    return afflictionRepository.findAllTags(options);
  }

  /**
   * Get tag by ID
   */
  async getTagById(id: number): Promise<Tag> {
    const tag = await afflictionRepository.findTagById(id);

    if (!tag) {
      throw new ApiError(404, 'Tag not found');
    }

    return tag;
  }

  /**
   * Create a new tag
   */
  async createTag(data: CreateTagDto): Promise<Tag> {
    // Check if tag with this name already exists
    const existingTag = await afflictionRepository.findTagByName(data.name);

    if (existingTag) {
      throw new ApiError(409, 'Tag with this name already exists');
    }

    return afflictionRepository.createTag(data);
  }

  /**
   * Delete a tag
   */
  async deleteTag(id: number): Promise<Tag> {
    // Check if tag exists
    const tag = await afflictionRepository.findTagById(id);

    if (!tag) {
      throw new ApiError(404, 'Tag not found');
    }

    try {
      return afflictionRepository.deleteTag(id);
    } catch (error) {
      // Check if there's a foreign key constraint error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'P2003') {
        throw new ApiError(409, 'Cannot delete tag that is still in use by afflictions');
      }

      throw error;
    }
  }

  /**
   * Get afflictions for a character
   */
  async getCharacterAfflictions(characterId: number): Promise<CharacterAfflictionWithAffliction[]> {
    // Check if character exists
    const character = await characterRepository.findById(characterId);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    return afflictionRepository.getCharacterAfflictions(
      characterId,
    ) as unknown as CharacterAfflictionWithAffliction[];
  }

  /**
   * Apply affliction to character
   */
  async applyAfflictionToCharacter(
    characterId: number,
    afflictionData: CharacterAfflictionDto,
  ): Promise<CharacterAfflictionWithAffliction> {
    // Check if character exists
    const character = await characterRepository.findById(characterId);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    // Check if affliction exists
    const affliction = await afflictionRepository.findAfflictionById(afflictionData.afflictionId);

    if (!affliction) {
      throw new ApiError(404, 'Affliction not found');
    }

    // Check if character already has this affliction
    const existingAffliction = await afflictionRepository.findCharacterAfflictionByIds(
      characterId,
      afflictionData.afflictionId,
    );

    if (existingAffliction) {
      throw new ApiError(409, 'Character already has this affliction');
    }

    return afflictionRepository.applyAfflictionToCharacter(
      characterId,
      afflictionData,
    ) as unknown as CharacterAfflictionWithAffliction;
  }

  /**
   * Update character affliction severity
   */
  async updateCharacterAffliction(
    characterId: number,
    afflictionId: number,
    severity: number,
  ): Promise<CharacterAfflictionWithAffliction> {
    // Find the character affliction
    const characterAffliction = await afflictionRepository.findCharacterAfflictionByIds(
      characterId,
      afflictionId,
    );

    if (!characterAffliction) {
      throw new ApiError(404, 'Character affliction not found');
    }

    return afflictionRepository.updateCharacterAffliction(
      characterAffliction.id,
      severity,
    ) as unknown as CharacterAfflictionWithAffliction;
  }

  /**
   * Remove affliction from character
   */
  async removeAfflictionFromCharacter(
    characterId: number,
    afflictionId: number,
  ): Promise<CharacterAffliction> {
    // Find the character affliction
    const characterAffliction = await afflictionRepository.findCharacterAfflictionByIds(
      characterId,
      afflictionId,
    );

    if (!characterAffliction) {
      throw new ApiError(404, 'Character affliction not found');
    }

    return afflictionRepository.removeAfflictionFromCharacter(characterAffliction.id);
  }
}

export default new AfflictionService();
