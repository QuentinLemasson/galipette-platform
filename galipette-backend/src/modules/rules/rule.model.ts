import { Rule as PrismaRule } from '@prisma/client';

// Rule domain model (extends Prisma generated type)
export interface Rule extends PrismaRule {}

// Rule creation DTO
export interface CreateRuleDto {
  key: string;
  data: any;
  description?: string;
}

// Rule update DTO
export interface UpdateRuleDto {
  data?: any;
  description?: string;
}

// Rule response DTO
export interface RuleResponseDto {
  id: number;
  key: string;
  data: any;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Function to map a Rule entity to a RuleResponseDto
export function mapToRuleDto(rule: Rule): RuleResponseDto {
  return {
    id: rule.id,
    key: rule.key,
    data: rule.data,
    ...(rule.description !== null &&
      rule.description !== undefined && {
        description: rule.description,
      }),
    createdAt: rule.createdAt,
    updatedAt: rule.updatedAt,
  };
}
