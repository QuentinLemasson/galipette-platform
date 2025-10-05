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
import {
  RouteSlot,
  RouteTags,
  type RouteConfig,
  type RoutesMap,
} from '@/app/types/routes.types';
import { lazy } from 'react';

// Lazy loaded components
const HomePage = lazy(() => import('../screens/HomePage'));
const DashboardPage = lazy(() => import('../screens/DashboardPage'));
const CampaignDashboardPage = lazy(
  () => import('../screens/CampainDashboard.page')
);
const CampaignManagementPage = lazy(
  () => import('../screens/CampainManagment.page')
);
const CharactersPage = lazy(() => import('../screens/CharactersPage'));
const CharacterDetailsPage = lazy(
  () => import('../screens/CharacterDetailsPage')
);
const ErrorCodePage = lazy(() => import('../screens/ErrorCodePage'));

// Pages config
export const PAGES = {
  // ** CORE PAGES **
  HOME: {
    path: '/home',
    displayName: 'Home',
    description: 'Home page',
    permissions: [],
    slots: [],
    tags: [RouteTags.CORE, RouteTags.HOME],
    component: HomePage,
  },
  DASHBOARD: {
    path: '/dashboard',
    displayName: 'Dashboard',
    description: 'Dashboard page',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.CORE, RouteTags.DASHBOARD, RouteTags.EXAMPLE],
    component: DashboardPage,
  },
  // ** CAMPAIGN PAGES **
  CAMPAIGNS: {
    path: '/campaigns',
    displayName: 'Campaigns',
    description: 'Campaigns list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.CAMPAIGNS, RouteTags.DASHBOARD],
    component: CampaignDashboardPage,
  },
  CAMPAIGN_MANAGEMENT: {
    path: '/campaigns/:campaignId',
    displayName: 'Campaign Management',
    description: 'Campaign management page',
    permissions: [],
    slots: [],
    tags: [RouteTags.CAMPAIGNS, RouteTags.EDITOR],
    component: CampaignManagementPage,
  },
  // ** CHARACTER PAGES **
  CHARACTERS: {
    path: '/characters',
    displayName: 'Characters',
    description: 'Characters list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.CHARACTERS, RouteTags.DASHBOARD],
    component: CharactersPage,
  },
  CHARACTER_DETAILS: {
    path: '/characters/:characterId',
    displayName: 'Character Details',
    description: 'Character details page',
    permissions: [],
    build: params => `/characters/${params.characterId}`,
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.CHARACTERS, RouteTags.EDITOR],
    component: CharacterDetailsPage,
  },
  ERROR_CODE: {
    path: '/:errorCode',
    displayName: 'Error',
    description: 'Error page',
    permissions: [],
    build: params => `/${params.errorCode}`,
    slots: [RouteSlot.ERROR],
    tags: [RouteTags.ERROR, RouteTags.CORE],
    component: ErrorCodePage,
  },
} as const satisfies RoutesMap;

export type PageKey = keyof typeof PAGES;

export const getPagesBySlot = (slot: RouteSlot): RouteConfig[] => {
  const pages = Object.values(PAGES) as RouteConfig[];
  return pages.filter(page => page.slots.includes(slot));
};
