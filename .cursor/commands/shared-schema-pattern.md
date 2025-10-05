# 📐 Shared Schema Pattern Architecture

## Overview

This document describes the **Shared Schema Pattern** used in the Galipette platform. This pattern centralizes validation schemas and type definitions in a shared library, ensuring consistency between frontend and backend while providing runtime validation with Zod.

---

## 🎯 Goals

1. **Single Source of Truth**: All DTOs and validation rules defined once
2. **Type Safety**: TypeScript types inferred from Zod schemas
3. **Runtime Validation**: Automatic validation at API boundaries
4. **Code Reusability**: Same types used in frontend and backend
5. **Maintainability**: Changes propagate automatically across the application

---

## 🏗️ Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│  - Imports types from @galipette/shared                    │
│  - Uses schemas for form validation                        │
│  - Type-safe API calls                                     │
└─────────────────────────────────────────────────────────────┘
                              ▲
                              │
┌─────────────────────────────┼─────────────────────────────┐
│     SHARED LIBRARY          │                             │
│  (@galipette/shared)        │                             │
│                             │                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  types/entity.schema.ts                             │  │
│  │  - Zod schemas (validation rules)                   │  │
│  │  - Inferred TypeScript types                        │  │
│  │  - Enums                                            │  │
│  └─────────────────────────────────────────────────────┘  │
│                             │                             │
└─────────────────────────────┼─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express + Prisma)                     │
│  - Imports schemas & types from @galipette/shared          │
│  - Validates requests with Zod schemas                     │
│  - Maps Prisma entities to DTOs with validation            │
│  - Type-safe database operations                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 File Structure

```
galipette-shared-lib/
└── types/
    ├── index.ts                 # Central export point
    ├── users.schema.ts          # User schemas & types
    ├── campaigns.schema.ts      # Campaign schemas & types
    └── [entity].schema.ts       # Other entity schemas

galipette-backend/
└── src/
    └── modules/
        └── [entity]/
            ├── [entity].model.ts      # Domain model + mapping
            ├── [entity].controller.ts # Request handlers
            ├── [entity].service.ts    # Business logic
            └── [entity].repository.ts # Data access
```

---

## 🔍 Pattern Components

### 1. Shared Schema File (`galipette-shared-lib/types/entity.schema.ts`)

**Structure:**

```typescript
import { z } from 'zod';

// ============================================
// ENUMS (if needed)
// ============================================
export enum EntityStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// ============================================
// INPUT VALIDATION SCHEMAS (Request DTOs)
// ============================================

// CREATE schema (POST)
export const createEntitySchema = z.object({
  name: z.string().min(3).max(100),
  status: z.nativeEnum(EntityStatus).optional(),
});

// UPDATE schema (PATCH)
export const updateEntitySchema = z.object({
  name: z.string().min(3).max(100).optional(),
  status: z.nativeEnum(EntityStatus).optional(),
});

// ID PARAM schema (route params)
export const entityIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// ============================================
// OUTPUT SCHEMAS (Response DTOs)
// ============================================

export const entityResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  status: z.nativeEnum(EntityStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================

export type CreateEntityDto = z.infer<typeof createEntitySchema>;
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>;
export type EntityIdParam = z.infer<typeof entityIdSchema>;
export type EntityResponseDto = z.infer<typeof entityResponseSchema>;
```

**Key Sections:**

1. **Enums**: Define status codes, roles, or other enumerated values
2. **Input Schemas**: Validation for incoming data (POST, PATCH)
3. **Output Schemas**: Structure for API responses
4. **Types**: TypeScript types inferred from schemas using `z.infer`

---

### 2. Central Export (`galipette-shared-lib/types/index.ts`)

```typescript
// Export all entity schemas and types
export * from './users.schema';
export * from './campaigns.schema';
export * from './characters.schema';
```

**Purpose**: Single import point for consumers

---

### 3. Backend Model File (`galipette-backend/src/modules/entity/entity.model.ts`)

**Structure:**

```typescript
import { Entity as PrismaEntity } from '@prisma/client';
import {
  CreateEntityDto,
  UpdateEntityDto,
  EntityResponseDto,
  EntityStatus,
  entityResponseSchema,
} from '@galipette/shared';

// ============================================
// DOMAIN MODEL (Internal Backend Type)
// ============================================

/**
 * Entity domain model (extends Prisma generated type)
 * This is the internal representation used within the backend
 */
export interface Entity extends PrismaEntity {}

// ============================================
// RE-EXPORT SHARED DTOs & ENUMS
// ============================================

/**
 * Re-export DTOs and enums from shared library for convenience
 * These are the types used at API boundaries
 */
export type { CreateEntityDto, UpdateEntityDto, EntityResponseDto };
export { EntityStatus };

// ============================================
// MAPPING FUNCTIONS
// ============================================

/**
 * Maps a Prisma Entity to an EntityResponseDto
 *
 * @param entity - The Prisma Entity from the database
 * @returns EntityResponseDto - The sanitized entity data for API responses
 *
 * Note: Uses Zod schema for runtime validation to ensure
 * the response always matches the expected contract
 */
export function mapToEntityDto(entity: Entity): EntityResponseDto {
  // Parse through Zod schema for runtime validation
  return entityResponseSchema.parse({
    id: entity.id,
    name: entity.name,
    status: entity.status,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
}
```

**Key Points:**

- **Domain Model**: Internal type extending Prisma
- **Re-exports**: Makes shared types available to other backend modules
- **Mapping Function**: Transforms Prisma entities to validated DTOs

---

## 🔧 Step-by-Step Refactoring Guide

### For a New Entity

#### **Step 1: Create Shared Schema File**

Create `galipette-shared-lib/types/[entity].schema.ts`:

```typescript
import { z } from 'zod';

// 1. Define enums (if needed)
export enum EntityStatus {
  ACTIVE = 'ACTIVE',
}

// 2. Create input schemas with validation rules
export const createEntitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  // Add all required fields with validation
});

export const updateEntitySchema = createEntitySchema.partial();

// 3. Create output schema
export const entityResponseSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 4. Infer types
export type CreateEntityDto = z.infer<typeof createEntitySchema>;
export type UpdateEntityDto = z.infer<typeof updateEntitySchema>;
export type EntityResponseDto = z.infer<typeof entityResponseSchema>;
```

#### **Step 2: Update Central Export**

In `galipette-shared-lib/types/index.ts`:

```typescript
export * from './entity.schema';
```

#### **Step 3: Create Backend Model**

Create `galipette-backend/src/modules/entity/entity.model.ts`:

```typescript
import { Entity as PrismaEntity } from '@prisma/client';
import {
  CreateEntityDto,
  UpdateEntityDto,
  EntityResponseDto,
  entityResponseSchema,
} from '@galipette/shared';

export interface Entity extends PrismaEntity {}

export type { CreateEntityDto, UpdateEntityDto, EntityResponseDto };

export function mapToEntityDto(entity: Entity): EntityResponseDto {
  return entityResponseSchema.parse({
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  });
}
```

#### **Step 4: Use in Controller**

```typescript
import { createEntitySchema, updateEntitySchema } from '@galipette/shared';
import { mapToEntityDto } from './entity.model';

export class EntityController {
  async createEntity(req: Request, res: Response): Promise<void> {
    try {
      // Validate with Zod schema
      const data = createEntitySchema.parse(req.body);

      const entity = await entityService.create(data);

      // Map to DTO with validation
      res.status(201).json(formatSuccess(mapToEntityDto(entity)));
    } catch (error) {
      if (error instanceof ZodError) {
        res
          .status(400)
          .json(
            formatError('Validation failed', formatZodErrors(error.issues))
          );
      }
    }
  }
}
```

---

### For Refactoring Existing Code

#### **Step 1: Analyze Current Structure**

Identify:

- ✅ DTOs defined in backend model
- ✅ Validation logic (if any)
- ✅ Enums used
- ✅ Mapping functions

#### **Step 2: Create Shared Schema**

Move all DTOs and validation to shared library:

1. Copy interface definitions
2. Convert to Zod schemas with validation rules
3. Add enums
4. Use `z.infer` to create types

**Before (Backend Only):**

```typescript
// backend/entity.model.ts
export interface CreateEntityDto {
  name: string;
  status?: string;
}
```

**After (Shared):**

```typescript
// shared-lib/types/entity.schema.ts
export const createEntitySchema = z.object({
  name: z.string().min(3).max(100),
  status: z.nativeEnum(EntityStatus).optional(),
});

export type CreateEntityDto = z.infer<typeof createEntitySchema>;
```

#### **Step 3: Refactor Backend Model**

Replace local definitions with imports:

```typescript
// Before
export interface CreateEntityDto { ... }
export interface EntityResponseDto { ... }

// After
import {
  CreateEntityDto,
  EntityResponseDto,
  entityResponseSchema,
} from '@galipette/shared';

export type { CreateEntityDto, EntityResponseDto };
```

Add validation to mapping function:

```typescript
// Before
export function mapToEntityDto(entity: Entity): EntityResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    // ...
  };
}

// After
export function mapToEntityDto(entity: Entity): EntityResponseDto {
  return entityResponseSchema.parse({
    id: entity.id,
    name: entity.name,
    // ...
  });
}
```

#### **Step 4: Update Controllers**

Replace manual validation with Zod:

```typescript
// Before
if (!req.body.name || req.body.name.length < 3) {
  return res.status(400).json({ error: 'Invalid name' });
}

// After
try {
  const data = createEntitySchema.parse(req.body);
  // ... use validated data
} catch (error) {
  if (error instanceof ZodError) {
    return res
      .status(400)
      .json(formatError('Validation failed', formatZodErrors(error.issues)));
  }
}
```

#### **Step 5: Test & Verify**

1. ✅ Run TypeScript compiler: `npm run build`
2. ✅ Check linter: No errors
3. ✅ Test API endpoints: Validation works
4. ✅ Verify error messages: User-friendly

---

## ✅ Benefits

| Benefit                | Description                                    |
| :--------------------- | :--------------------------------------------- |
| **Type Safety**        | TypeScript ensures correctness at compile time |
| **Runtime Validation** | Zod validates data at runtime                  |
| **Single Source**      | One place to define all contracts              |
| **Consistency**        | Frontend and backend use same types            |
| **Maintainability**    | Change once, update everywhere                 |
| **Better Errors**      | Zod provides detailed validation errors        |
| **Documentation**      | Schemas serve as documentation                 |

---

## 🚨 Common Pitfalls

### ❌ Defining DTOs in Multiple Places

```typescript
// DON'T: Define DTO in backend
export interface CreateUserDto {
  email: string;
}
```

✅ **DO**: Define in shared library with validation

```typescript
// shared-lib/types/users.schema.ts
export const createUserSchema = z.object({
  email: z.string().email(),
});
export type CreateUserDto = z.infer<typeof createUserSchema>;
```

---

### ❌ Skipping Validation in Mapping

```typescript
// DON'T: Return raw object
return {
  id: entity.id,
  name: entity.name,
};
```

✅ **DO**: Parse through schema

```typescript
return entityResponseSchema.parse({
  id: entity.id,
  name: entity.name,
});
```

---

### ❌ Importing from Wrong Location

```typescript
// DON'T: Import from backend
import { CreateUserDto } from '@backend/modules/users/user.model';
```

✅ **DO**: Import from shared

```typescript
import { CreateUserDto } from '@galipette/shared';
```

---

## 📚 Reference Examples

### Complete User Implementation

- ✅ `galipette-shared-lib/types/users.schema.ts`
- ✅ `galipette-backend/src/modules/users/user.model.ts`
- ✅ `galipette-backend/src/modules/users/user.controller.ts`

### Complete Campaign Implementation

- ✅ `galipette-shared-lib/types/campaigns.schema.ts`
- ✅ `galipette-backend/src/modules/campaigns/campaign.model.ts`
- ✅ `galipette-backend/src/modules/campaigns/campaign.controller.ts`

---

## 🔄 Next Steps

When adding a new entity:

1. [ ] Create `[entity].schema.ts` in shared library
2. [ ] Add export to `types/index.ts`
3. [ ] Create backend model using shared types
4. [ ] Use schemas in controllers for validation
5. [ ] Test validation with invalid data
6. [ ] Document any entity-specific patterns

---

## 📖 Resources

- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook - Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)

---

**Last Updated**: October 5, 2025  
**Pattern Version**: 1.0  
**Status**: ✅ Active
