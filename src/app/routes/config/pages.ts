/**
 * PAGES is the single source of truth for all app routes.
 *
 * Each entry describes a route's path and UI metadata. Dynamic routes
 * may provide a `build` function that turns params into a concrete path.
 *
 * This config is used by:
 * - Router creation (to derive route paths)
 * - Navigation hooks (for declarative navigation and active state)
 * - UI (menus, breadcrumbs, etc)
 */
import type { RoutesMap } from '@/app/types/routes';

export const PAGES = {
  HOME: {
    path: '/home',
    displayName: 'Home',
    description: 'Home page',
    permissions: [],
  },
  DASHBOARD: {
    path: '/dashboard',
    displayName: 'Dashboard',
    description: 'Dashboard page',
    permissions: [],
  },
  CHARACTERS: {
    path: '/characters',
    displayName: 'Characters',
    description: 'Characters list',
    permissions: [],
  },
  CHARACTER_DETAILS: {
    path: '/characters/:characterId',
    displayName: 'Character Details',
    description: 'Character details page',
    permissions: [],
    build: params => `/characters/${params.characterId}`,
  },
  ERROR_CODE: {
    path: '/:errorCode',
    displayName: 'Error',
    description: 'Error page',
    permissions: [],
    build: params => `/${params.errorCode}`,
  },
} as const satisfies RoutesMap;

export type PageKey = keyof typeof PAGES;
