import prisma from '../../config/db';
import {
  Campaign,
  CreateCampaignDto,
  UpdateCampaignDto,
  CampaignPlayerDto,
  CampaignUser,
} from './campaign.model';
import { CampaignRole } from '@prisma/client';

interface FindAllOptions {
  playerId?: number;
  ids?: number[];
  skip?: number;
  take?: number;
}

export class CampaignRepository {
  /**
   * Find all campaigns with pagination and filters
   */
  async findAll(options?: FindAllOptions): Promise<{ campaigns: Campaign[]; count: number }> {
    const { playerId, ids, skip = 0, take = 10 } = options || {};

    // Build where conditions
    let where: any = {};

    if (ids && ids.length > 0) {
      where.id = { in: ids };
    }

    if (playerId) {
      where.players = {
        some: {
          userId: playerId,
        },
      };
    }

    // Execute query with pagination and get count
    const [campaigns, count] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      }),
      prisma.campaign.count({ where }),
    ]);

    return { campaigns, count };
  }

  /**
   * Find campaign by ID
   */
  async findById(id: number, includePlayers = false): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: { id },
      ...(includePlayers && {
        include: {
          players: {
            include: {
              user: true,
            },
          },
        },
      }),
    });
  }

  /**
   * Get players for a campaign
   */
  async getCampaignPlayers(campaignId: number): Promise<CampaignPlayerDto[]> {
    const campaignUsers = await prisma.campaignUser.findMany({
      where: { campaignId },
      include: { user: true },
    });

    return campaignUsers.map((cu) => ({
      userId: cu.userId,
      username: cu.user.username,
      email: cu.user.email,
      role: cu.role,
    }));
  }

  /**
   * Create a new campaign
   */
  async create(data: CreateCampaignDto): Promise<Campaign> {
    const { ownerId, ...campaignData } = data;

    return prisma.$transaction(async (tx) => {
      // Create the campaign
      const campaign = await tx.campaign.create({
        data: campaignData,
      });

      // Add the owner as a GM
      await tx.campaignUser.create({
        data: {
          userId: ownerId,
          campaignId: campaign.id,
          role: CampaignRole.GM,
        },
      });

      return campaign;
    });
  }

  /**
   * Update a campaign
   */
  async update(id: number, data: UpdateCampaignDto): Promise<Campaign> {
    return prisma.campaign.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a campaign
   */
  async delete(id: number): Promise<Campaign> {
    return prisma.campaign.delete({
      where: { id },
    });
  }

  /**
   * Add a player to a campaign
   */
  async addPlayer(campaignId: number, userId: number, role: CampaignRole): Promise<CampaignUser> {
    return prisma.campaignUser.create({
      data: {
        campaignId,
        userId,
        role,
      },
    });
  }

  /**
   * Remove a player from a campaign
   */
  async removePlayer(campaignId: number, userId: number): Promise<void> {
    await prisma.campaignUser.delete({
      where: {
        userId_campaignId: {
          userId,
          campaignId,
        },
      },
    });
  }

  /**
   * Check if a user is part of a campaign
   */
  async isUserInCampaign(campaignId: number, userId: number): Promise<boolean> {
    const count = await prisma.campaignUser.count({
      where: {
        campaignId,
        userId,
      },
    });

    return count > 0;
  }

  /**
   * Get a user's role in a campaign
   */
  async getUserRole(campaignId: number, userId: number): Promise<CampaignRole | null> {
    const campaignUser = await prisma.campaignUser.findUnique({
      where: {
        userId_campaignId: {
          userId,
          campaignId,
        },
      },
    });

    return campaignUser ? campaignUser.role : null;
  }
}

export default new CampaignRepository();
