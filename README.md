# Galipette Portal

A React + TypeScript + Vite application built with a **feature-first directory architecture**.

## Architecture Overview

This project uses a modern feature-first directory structure that organizes code by business features rather than technical concerns.

### Directory Structure

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

### Key Principles

1. **Feature Isolation**: Each feature is self-contained with its own components, logic, and dependencies
2. **Barrel Exports**: Each layer exports its public API through `index.ts` files
3. **Clear Boundaries**: No direct dependencies between features
4. **Reusability**: Common layer contains truly reusable code

### Layer Responsibilities

- **`app/`**: Application orchestration, routing, global state, app configuration
- **`common/`**: Generic, reusable components and utilities (no business logic)
  - **`common/ui/`**: Shadcn UI components and design system components
  - **`common/components/`**: Custom generic components
- **`features/`**: Business features with domain-specific logic and components

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Building

```bash
npm run build
```

### Architecture Benefits

- **Scalability**: Easy to add new features without affecting existing ones
- **Team Collaboration**: Teams can work on different features independently
- **Code Discovery**: Related code is co-located
- **Maintainability**: Clear boundaries and responsibilities
- **Testing**: Feature-level testing is straightforward
- **Code Splitting**: Natural boundaries for lazy loading

### Import Guidelines

```typescript
// ✅ Use barrel exports
import { Button } from '@/common';
import { WelcomeMessage } from '@/features/welcome';

// ❌ Avoid direct imports
import { Button } from '@/common/components/Button';
```

## Technical Stack

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
