# @galipette/shared - Shared Library

This package contains shared types, schemas, and validation logic used across the Galipette Cendree TTRPG platform (backend and frontend).

## 📦 Architecture Overview

```
┌─────────────────────────────────────────┐
│  DATABASE (PostgreSQL)                   │
└──────────────┬──────────────────────────┘
               │
      ┌────────▼────────┐
      │ schema.prisma   │ ◄── Database structure (source of truth)
      └────────┬────────┘
               │ generates
               │
      ┌────────▼────────────┐
      │  Prisma Client      │ ◄── Internal DB types
      │  (User type)        │
      └─────────────────────┘
               │ maps to
               │
      ┌────────▼──────────────────────┐
      │ @galipette/shared             │ ◄── API contract (THIS PACKAGE)
      │ (Zod schemas + inferred types)│
      └────────┬──────────────────────┘
               │
       ┌───────┴───────┐
       │               │
┌──────▼──────┐  ┌────▼─────────┐
│  Backend    │  │  Frontend    │
│  (validates)│  │  (validates) │
└─────────────┘  └──────────────┘
```

## 🎯 Purpose

### Single Source of Truth

- Define validation rules once
- Share TypeScript types across boundaries
- Ensure frontend and backend speak the same language

### Runtime Validation

- Unlike TypeScript interfaces (compile-time only)
- Zod validates at runtime
- Catch invalid data before processing

### Type Safety

- Infer TypeScript types from Zod schemas
- No type duplication
- Type changes propagate automatically

## 📚 Usage Examples

### Backend Usage

```typescript
// galipette-backend/src/modules/users/user.controller.ts
import { createUserSchema, UserResponseDto } from '@galipette/shared';
import { ZodError } from 'zod';

// Validate incoming request
try {
  const userData = createUserSchema.parse(req.body);
  // userData is now typed as CreateUserDto
  const user = await userService.createUser(userData);
  res.json(formatSuccess(user));
} catch (error) {
  if (error instanceof ZodError) {
    // Handle validation errors with detailed error messages
    res
      .status(400)
      .json(formatError('Validation failed', formatZodErrors(error.issues)));
  }
}
```

### Frontend Usage

```typescript
// galipette-portal/src/features/users/CreateUserForm.tsx
import { createUserSchema, CreateUserDto } from '@galipette/shared';
import { useState } from 'react';

function CreateUserForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const handleSubmit = async (formData: CreateUserDto) => {
    try {
      // Validate on client-side before sending
      const validated = createUserSchema.parse(formData);

      // Send to API
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(validated),
      });

      // Response is typed as UserResponseDto
      const user: UserResponseDto = await response.json();

    } catch (error) {
      if (error instanceof ZodError) {
        // Show validation errors in form
        const formatted = formatZodErrors(error.issues);
        setErrors(formatted);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields with error messages */}
      {errors.email && <span>{errors.email[0]}</span>}
    </form>
  );
}
```

## 📖 Available Schemas

### Users Module

#### Input Schemas (Request DTOs)

- `createUserSchema` - Validation for creating users
- `updateUserSchema` - Validation for updating users
- `userIdSchema` - Validation for user ID parameters

#### Output Schemas (Response DTOs)

- `userResponseSchema` - Structure of user responses
- `userListResponseSchema` - Structure of paginated user lists

#### TypeScript Types

```typescript
type CreateUserDto = {
  email: string; // Must be valid email
  username: string; // 3-50 chars, alphanumeric + _ -
};

type UpdateUserDto = {
  email?: string; // Optional, must be valid if provided
  username?: string; // Optional, same rules as above
};

type UserResponseDto = {
  id: number;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};
```

## 🔧 Adding New Schemas

1. Create a new schema file (e.g., `types/characters.schema.ts`)
2. Define Zod schemas with validation rules
3. Export inferred types
4. Re-export from `types/index.ts`

Example:

```typescript
// types/characters.schema.ts
import { z } from 'zod';

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(100),
  raceId: z.number().int().positive(),
});

export type CreateCharacterDto = z.infer<typeof createCharacterSchema>;
```

## 🎨 Benefits

### For Backend

- ✅ Automatic validation with clear error messages
- ✅ No manual validation code
- ✅ Type-safe request/response handling
- ✅ Consistent error formats

### For Frontend

- ✅ Client-side validation before API calls
- ✅ Type-safe API interactions
- ✅ Reduced API errors
- ✅ Better UX with immediate feedback

### For Team

- ✅ Single source of truth
- ✅ API contract changes propagate automatically
- ✅ Fewer bugs from type mismatches
- ✅ Self-documenting validation rules

## 📝 Validation Rules Reference

Current validation rules for users:

| Field      | Rules                                                    |
| ---------- | -------------------------------------------------------- |
| `email`    | Valid email format                                       |
| `username` | 3-50 characters, alphanumeric + underscore + hyphen only |

## 🚀 Future Enhancements

- [ ] Add schemas for other modules (characters, campaigns, etc.)
- [ ] Add custom Zod refinements for business rules
- [ ] Generate OpenAPI/Swagger docs from schemas
- [ ] Add localized error messages
