import prisma from '../../config/db';
import { User, CreateUserDto, UpdateUserDto } from './user.model';

interface FindAllOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

export class UserRepository {
  /**
   * Find all users with pagination and filters
   */
  async findAll(options?: FindAllOptions): Promise<{ users: User[]; count: number }> {
    const { ids, skip = 0, take = 10 } = options || {};

    // Base query conditions
    const where = ids && ids.length > 0 ? { id: { in: ids } } : {};

    // Execute query with pagination and get count
    const [users, count] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { id: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, count };
  }

  /**
   * Find user by ID with optional field selection
   */
  async findById(id: number, select?: Record<string, boolean>): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      ...(select && { select }),
    });
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update a user
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user
   */
  async delete(id: number): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
