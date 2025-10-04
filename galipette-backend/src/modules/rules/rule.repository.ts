import prisma from '../../config/db';
import { Rule, CreateRuleDto, UpdateRuleDto } from './rule.model';

interface FindAllOptions {
  skip?: number;
  take?: number;
}

export class RuleRepository {
  /**
   * Find all rules with pagination
   */
  async findAll(options?: FindAllOptions): Promise<{ rules: Rule[]; count: number }> {
    const { skip = 0, take = 10 } = options || {};

    // Execute query with pagination and get count
    const [rules, count] = await Promise.all([
      prisma.rule.findMany({
        skip,
        take,
        orderBy: { key: 'asc' },
      }),
      prisma.rule.count(),
    ]);

    return { rules, count };
  }

  /**
   * Find rule by key
   */
  async findByKey(key: string): Promise<Rule | null> {
    return prisma.rule.findUnique({
      where: { key },
    });
  }

  /**
   * Find rule by ID
   */
  async findById(id: number): Promise<Rule | null> {
    return prisma.rule.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new rule
   */
  async create(data: CreateRuleDto): Promise<Rule> {
    return prisma.rule.create({
      data,
    });
  }

  /**
   * Update a rule by key
   */
  async updateByKey(key: string, data: UpdateRuleDto): Promise<Rule> {
    return prisma.rule.update({
      where: { key },
      data,
    });
  }

  /**
   * Delete a rule by key
   */
  async deleteByKey(key: string): Promise<Rule> {
    return prisma.rule.delete({
      where: { key },
    });
  }
}

export default new RuleRepository();
