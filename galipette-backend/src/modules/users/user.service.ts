import { User, CreateUserDto, UpdateUserDto } from './user.model';
import userRepository from './user.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllUsersOptions {
  ids?: number[];
  skip?: number;
  take?: number;
}

class UserService {
  /**
   * Get all users
   */
  async getAllUsers(options?: GetAllUsersOptions): Promise<{ users: User[]; count: number }> {
    const skip = options?.skip ?? 0;
    const take = options?.take ?? 10;
    // Only include ids if it's defined, to match the expected type
    if (options?.ids !== undefined) {
      return userRepository.findAll({ ids: options.ids, skip, take });
    } else {
      return userRepository.findAll({ skip, take });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: number, select?: Record<string, boolean>): Promise<User | null> {
    return userRepository.findById(id, select);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    return userRepository.create(userData);
  }

  /**
   * Update a user
   */
  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    // Check if email is being updated and if it's already in use
    if (userData.email && userData.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(userData.email);
      if (emailExists) {
        throw new ApiError(409, 'Email already in use');
      }
    }

    return userRepository.update(id, userData);
  }

  /**
   * Delete a user
   */
  async deleteUser(id: number): Promise<User> {
    // Check if user exists
    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new ApiError(404, 'User not found');
    }

    return userRepository.delete(id);
  }
}

export default new UserService();
