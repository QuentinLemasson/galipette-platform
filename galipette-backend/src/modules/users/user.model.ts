import { User as PrismaUser } from '@prisma/client';

// User domain model (extends Prisma generated type)
export interface User extends PrismaUser {}

// User creation DTO
export interface CreateUserDto {
  email: string;
  username: string;
}

// User update DTO
export interface UpdateUserDto {
  email?: string;
  username?: string;
}

// User response DTO
export interface UserResponseDto {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to map a User entity to a UserResponseDto
export function mapToUserDto(user: User): UserResponseDto {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
