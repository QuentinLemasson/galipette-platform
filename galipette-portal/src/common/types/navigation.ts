/**
 * Navigation types build on top of route config to expose a declarative
 * API for moving around the app, reading active state and UI metadata.
 */
import type { RouteConfig } from '@/app/types/routes';
import type { PAGES } from '@/app/routes/config/pages';

export type PageKey = keyof typeof PAGES;

export type NavigationRoute = RouteConfig & {
  navigate: (params?: Record<string, string>) => void;
  replace: (params?: Record<string, string>) => void;
  isActive: boolean;
  isActiveStart: boolean;
};

export type NavigationApi = {
  pages: Record<PageKey, NavigationRoute> & {
    // dynamic helpers keep strong types for params
    CHARACTER_DETAILS: NavigationRoute;
    ERROR_CODE: NavigationRoute;
  };
  go: (page: RouteConfig, params?: Record<string, string>) => void;
  replace: (page: RouteConfig, params?: Record<string, string>) => void;
  goBack: () => void;
  goForward: () => void;
  currentPath: string;
};
