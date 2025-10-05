import type { LucideIcon } from 'lucide-react';

/**
 * Shared routing primitives used across the application.
 *
 * These types define a single source of truth for route metadata and
 * optional path builders for dynamic routes.
 */
export type RoutePermissions = string[];

/**
 * Parameter bag for dynamic routes. Keys map to placeholder names
 * present in a route path (e.g. "/characters/:characterId").
 */
export type RouteParams = Record<string, string | number>;

export enum RouteSlot {
  NAVBAR = 'navbar',
  ERROR = 'error',
}

export enum RouteTags {
  // ** Core Tags **
  CORE = 'core',
  HOME = 'home',
  ERROR = 'error',
  DASHBOARD = 'dashboard',
  EDITOR = 'editor',
  //** Feature Tags **
  CAMPAIGNS = 'campaign',
  CHARACTERS = 'character',
  // ** For Development Purposes **
  EXAMPLE = 'example',
}

export type RouteComponent =
  | React.ComponentType
  | React.LazyExoticComponent<React.ComponentType>;

/**
 * Route metadata contract.
 * - path: absolute pathname including dynamic placeholders
 * - displayName/description: UI metadata for menus, breadcrumbs, etc.
 * - permissions: optional list for auth/visibility concerns
 * - build: optional function to build a concrete path from params
 */
export type RouteConfig = {
  path: string;
  displayName: string;
  description: string;
  component: RouteComponent;
  icon?: LucideIcon;
  permissions: RoutePermissions;
  build?: (params: RouteParams) => string;
  slots: RouteSlot[];
  tags: RouteTags[];
};

/**
 * Mapping of logical page keys to their route configuration.
 */
export type RoutesMap = Record<string, RouteConfig>;
