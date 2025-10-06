import prisma from '../../config/db';
import {
  Character,
  CharacterAttribute,
  CreateCharacterDto,
  UpdateCharacterDto,
  CharacterAttributeDto,
} from './character.model';
import { AttributeType } from '@prisma/client';

interface FindAllOptions {
  campaignId?: number;
  playerId?: number;
  ids?: number[];
  skip?: number;
  take?: number;
}

export class CharacterRepository {
  /**
   * Find all characters with pagination and filters
   */
  async findAll(
    options?: FindAllOptions
  ): Promise<{ characters: Character[]; count: number }> {
    const { campaignId, playerId, ids, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (campaignId) {
      where.campaignId = campaignId;
    }

    if (playerId) {
      where.userId = playerId;
    }

    // Execute query with pagination and get count
    const [characters, count] = await Promise.all([
      prisma.character.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
        include: {
          ancestry: true,
        },
      }),
      prisma.character.count({ where }),
    ]);

    return { characters, count };
  }

  /**
   * Find character by ID
   */
  async findById(
    id: number,
    includeDetails = false
  ): Promise<Character | null> {
    return prisma.character.findUnique({
      where: { id },
      include: includeDetails
        ? {
            ancestry: true,
            attributes: true,
            afflictions: {
              include: {
                affliction: true,
              },
            },
          }
        : {
            ancestry: true,
          },
    });
  }

  /**
   * Create a new character
   */
  async create(data: CreateCharacterDto): Promise<Character> {
    const { attributes, ...characterData } = data;

    return prisma.$transaction(async tx => {
      // Create the character
      const character = await tx.character.create({
        data: characterData,
        include: {
          ancestry: true,
        },
      });

      // Add attributes if provided
      if (attributes && attributes.length > 0) {
        await Promise.all(
          attributes.map(attr =>
            tx.characterAttribute.create({
              data: {
                characterId: character.id,
                type: attr.type,
                value: attr.value,
              },
            })
          )
        );
      } else {
        // Create default attributes with value 0
        const attributeTypes = Object.values(AttributeType);
        await Promise.all(
          attributeTypes.map(type =>
            tx.characterAttribute.create({
              data: {
                characterId: character.id,
                type,
                value: 0,
              },
            })
          )
        );
      }

      return character;
    });
  }

  /**
   * Update a character
   */
  async update(id: number, data: UpdateCharacterDto): Promise<Character> {
    return prisma.character.update({
      where: { id },
      data,
      include: {
        ancestry: true,
      },
    });
  }

  /**
   * Delete a character
   */
  async delete(id: number): Promise<Character> {
    return prisma.character.delete({
      where: { id },
    });
  }

  /**
   * Get all attributes for a character
   */
  async getAttributes(characterId: number): Promise<CharacterAttribute[]> {
    return prisma.characterAttribute.findMany({
      where: {
        characterId,
      },
    });
  }

  /**
   * Update multiple attributes for a character
   */
  async updateAttributes(
    characterId: number,
    attributes: CharacterAttributeDto[]
  ): Promise<CharacterAttribute[]> {
    const results: CharacterAttribute[] = [];
    for (const attr of attributes) {
      const updateRes = await prisma.characterAttribute.updateMany({
        where: { characterId, type: attr.type },
        data: { value: attr.value },
      });
      if (updateRes.count === 0) {
        const created = await prisma.characterAttribute.create({
          data: { characterId, type: attr.type, value: attr.value },
        });
        results.push(created as unknown as CharacterAttribute);
      } else {
        const updated = await prisma.characterAttribute.findFirst({
          where: { characterId, type: attr.type },
        });
        if (updated) results.push(updated as unknown as CharacterAttribute);
      }
    }
    return results;
  }

  /**
   * Update a single attribute for a character
   */
  async updateAttribute(
    characterId: number,
    attributeType: AttributeType,
    value: number
  ): Promise<CharacterAttribute> {
    const updateRes = await prisma.characterAttribute.updateMany({
      where: { characterId, type: attributeType },
      data: { value },
    });
    if (updateRes.count === 0) {
      return prisma.characterAttribute.create({
        data: { characterId, type: attributeType, value },
      }) as unknown as CharacterAttribute;
    }
    const updated = await prisma.characterAttribute.findFirst({
      where: { characterId, type: attributeType },
    });
    return updated as unknown as CharacterAttribute;
  }
}

export default new CharacterRepository();
