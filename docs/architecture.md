# Architecture Guide

## Overview

This project uses a **feature-first directory architecture** that organizes code by business features rather than technical concerns. This approach provides better scalability, maintainability, and team collaboration.

## Directory Structure

```
src/
├── app/                    # Application layer
│   ├── components/        # App-level components
│   ├── hooks/            # App-level hooks
│   ├── services/         # App-level services
│   └── store/            # Global state management
│
├── common/               # Shared layer (reusable across features)
│   ├── components/       # Generic custom components
│   ├── ui/              # Shadcn UI components
│   ├── hooks/           # Generic hooks
│   ├── utils/           # Utility functions
│   ├── services/        # Shared services
│   └── types/           # Shared type definitions
│
├── features/            # Feature modules
│   └── welcome/         # Welcome feature
│       ├── components/  # Feature-specific components
│       ├── hooks/       # Feature-specific hooks
│       ├── services/   # Feature-specific services
│       └── types/      # Feature-specific types
│
└── assets/             # Static assets
```

## Layer Responsibilities

### App Layer (`src/app/`)

- **Purpose**: Application orchestration and global concerns
- **Contains**: Main App component, routing, global state, app configuration
- **Examples**: App.tsx, router configuration, global providers

### Common Layer (`src/common/`)

- **Purpose**: Reusable code across features
- **Contains**: Generic components, utilities, shared services
- **Examples**: Button component, API client, utility functions
- **Rules**: No business logic, framework-agnostic when possible

### Features Layer (`src/features/`)

- **Purpose**: Business features with domain-specific logic
- **Contains**: Feature components, hooks, services, types
- **Examples**: User management, dashboard, authentication
- **Rules**: Self-contained, no direct feature-to-feature dependencies

## Key Principles

### 1. Feature Isolation

Each feature is completely self-contained:

- Own components, hooks, services, and types
- No direct imports between features
- Communication through shared services or events

### 2. Barrel Exports

Each layer exports its public API through `index.ts` files:

```typescript
// features/authentication/index.ts
export { LoginForm, RegisterForm } from './components';
export { useAuth, useLogin } from './hooks';
export { authApi } from './services';
export type { User, AuthState } from './types';
```

### 3. Clear Boundaries

- **App ↔ Features**: App orchestrates features
- **Common ↔ Features**: Features use common utilities
- **Features ↔ Features**: No direct dependencies

### 4. Import Guidelines

```typescript
// ✅ Correct imports
import { Button } from '@/common';
import { WelcomeMessage } from '@/features/welcome';
import { useAuth } from '@/features/authentication';

// ❌ Avoid direct imports
import { Button } from '@/common/ui/button';
import { LoginForm } from '@/features/authentication/components/LoginForm';
```

### 5. Path Aliases

The project uses comprehensive path aliases for better developer experience:

```typescript
// Layer-specific aliases
import { App } from '@/app'; // App layer
import { Button } from '@/common'; // Common layer
import { WelcomeMessage } from '@/features/welcome'; // Features layer
import { logo } from '@/assets/logo.svg'; // Assets
import { server } from '@/test/mocks/server'; // Test utilities

// Shadcn/ui aliases (from components.json)
import { Button } from '@/ui/button'; // Shadcn UI components
import { cn } from '@/utils'; // Shadcn utility function
import { SomeComponent } from '@/components/SomeComponent'; // Common components
import { useLocalStorage } from '@/hooks/useLocalStorage'; // Common hooks
import { formatDate } from '@/lib/dateUtils'; // Common utilities
```

**Available Aliases:**

- `@/` - Root src directory
- `@/app/*` - Application layer
- `@/common/*` - Shared/common layer
- `@/features/*` - Feature modules
- `@/assets/*` - Static assets
- `@/test/*` - Test utilities and mocks

**Shadcn/ui Aliases (from components.json):**

- `@/components/*` - Common components (maps to `@/common/*`)
- `@/utils` - Shadcn utility function (maps to `@/common/utils/shadcn.util`)
- `@/ui/*` - Shadcn UI components (maps to `@/common/ui/*`)
- `@/lib/*` - Common utilities (maps to `@/common/utils/*`)
- `@/hooks/*` - Common hooks (maps to `@/common/hooks/*`)

## Benefits

### Scalability

- Easy to add new features without affecting existing ones
- Clear boundaries prevent coupling
- Natural code splitting boundaries

### Team Collaboration

- Teams can work on different features independently
- Clear ownership of code areas
- Reduced merge conflicts

### Maintainability

- Related code is co-located
- Clear separation of concerns
- Easy to understand and modify

### Testing

- Feature-level testing is straightforward
- Isolated unit tests
- Clear test boundaries

## Migration Strategy

When converting from a traditional structure:

1. **Identify Features**: Map current app to business features
2. **Create Feature Folders**: Start with one feature
3. **Move Code**: Gradually move related code into features
4. **Update Imports**: Refactor imports to use feature APIs
5. **Repeat**: Continue with other features

## Best Practices

### Feature Design

- Keep features focused on a single business domain
- Avoid feature-to-feature dependencies
- Use events or shared services for communication

### Component Organization

- Group related components together
- Use descriptive folder names
- Maintain consistent file naming

### State Management

- Feature-specific state in feature folders
- Global state in app layer
- Shared state in common layer

## Common Patterns

### Feature Communication

```typescript
// Using events
const eventBus = new EventBus();
eventBus.emit('user:login', userData);

// Using shared services
const authService = new AuthService();
authService.login(credentials);
```

### Feature Composition

```typescript
// App.tsx
import { AuthenticationFeature } from '@/features/authentication';
import { DashboardFeature } from '@/features/dashboard';

export const App = () => {
  return (
    <Routes>
      <Route path="/auth" element={<AuthenticationFeature />} />
      <Route path="/dashboard" element={<DashboardFeature />} />
    </Routes>
  );
};
```

This architecture provides a solid foundation for scalable React applications while maintaining clear boundaries and excellent developer experience.
