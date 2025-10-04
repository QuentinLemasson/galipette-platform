import {
  Character,
  CreateCharacterDto,
  UpdateCharacterDto,
  CharacterAttributeDto,
  UpdateCharacterAttributesDto,
} from './character.model';
import characterRepository from './character.repository';
import userRepository from '../users/user.repository';
import campaignRepository from '../campaigns/campaign.repository';
import { ApiError } from '../../middleware/errorHandler';
import { AttributeType } from '@prisma/client';

interface GetAllCharactersOptions {
  campaignId?: number;
  playerId?: number;
  ids?: number[];
  skip?: number;
  take?: number;
}

class CharacterService {
  /**
   * Get all characters with filtering
   */
  async getAllCharacters(
    options?: GetAllCharactersOptions,
  ): Promise<{ characters: Character[]; count: number }> {
    return characterRepository.findAll(options);
  }

  /**
   * Get character by ID
   */
  async getCharacterById(id: number, includeDetails = false): Promise<Character> {
    const character = await characterRepository.findById(id, includeDetails);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    return character;
  }

  /**
   * Create a new character
   */
  async createCharacter(data: CreateCharacterDto): Promise<Character> {
    // Check if user exists
    const user = await userRepository.findById(data.userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Check if campaign exists
    const campaign = await campaignRepository.findById(data.campaignId);
    if (!campaign) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Check if user is part of the campaign
    const isUserInCampaign = await campaignRepository.isUserInCampaign(
      data.campaignId,
      data.userId,
    );
    if (!isUserInCampaign) {
      throw new ApiError(403, 'User is not part of this campaign');
    }

    return characterRepository.create(data);
  }

  /**
   * Update a character
   */
  async updateCharacter(id: number, data: UpdateCharacterDto): Promise<Character> {
    // Check if character exists
    const character = await characterRepository.findById(id);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    // If race is being changed, verify the race exists
    if (data.raceId) {
      // In a real app, you'd check if the race exists here
    }

    return characterRepository.update(id, data);
  }

  /**
   * Delete a character
   */
  async deleteCharacter(id: number): Promise<Character> {
    // Check if character exists
    const character = await characterRepository.findById(id);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    return characterRepository.delete(id);
  }

  /**
   * Get attributes for a character
   */
  async getCharacterAttributes(characterId: number): Promise<CharacterAttributeDto[]> {
    // Check if character exists
    const character = await characterRepository.findById(characterId);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    const attributes = await characterRepository.getAttributes(characterId);

    return attributes.map((attr) => ({
      type: attr.type,
      value: attr.value,
    }));
  }

  /**
   * Update multiple attributes for a character
   */
  async updateCharacterAttributes(
    characterId: number,
    data: UpdateCharacterAttributesDto,
  ): Promise<CharacterAttributeDto[]> {
    // Check if character exists
    const character = await characterRepository.findById(characterId);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    // Validate attributes
    if (!data.attributes || data.attributes.length === 0) {
      throw new ApiError(400, 'No attributes provided');
    }

    // Check if all attribute types are valid
    const validTypes = Object.values(AttributeType);
    const invalidTypes = data.attributes.filter((attr) => !validTypes.includes(attr.type));

    if (invalidTypes.length > 0) {
      throw new ApiError(
        400,
        `Invalid attribute types: ${invalidTypes.map((attr) => attr.type).join(', ')}`,
      );
    }

    await characterRepository.updateAttributes(characterId, data.attributes);

    return this.getCharacterAttributes(characterId);
  }

  /**
   * Update a single attribute for a character
   */
  async updateCharacterAttribute(
    characterId: number,
    attributeType: AttributeType,
    value: number,
  ): Promise<CharacterAttributeDto> {
    // Check if character exists
    const character = await characterRepository.findById(characterId);

    if (!character) {
      throw new ApiError(404, 'Character not found');
    }

    // Check if attribute type is valid
    if (!Object.values(AttributeType).includes(attributeType)) {
      throw new ApiError(400, `Invalid attribute type: ${attributeType}`);
    }

    const updatedAttr = await characterRepository.updateAttribute(
      characterId,
      attributeType,
      value,
    );

    return {
      type: updatedAttr.type,
      value: updatedAttr.value,
    };
  }
}

export default new CharacterService();
