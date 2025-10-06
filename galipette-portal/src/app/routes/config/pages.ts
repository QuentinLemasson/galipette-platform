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
// Campaign feature screens
const CampaignListPage = lazy(
  () => import('@/features/campaign/screens/CampaignListPage')
);
const CampaignDashboardPage = lazy(
  () => import('@/features/campaign/screens/CampaignDashboardPage')
);
const CampaignManagementPage = lazy(
  () => import('@/features/campaign/screens/CampaignManagementPage')
);
const CampaignCreatePage = lazy(
  () => import('@/features/campaign/screens/CampaignCreatePage')
);
// Ancestries feature screens
const AncestriesListPage = lazy(
  () => import('@/features/ancestries/screens/ancestriesList.page')
);
const AncestriesDetailsPage = lazy(
  () => import('@/features/ancestries/screens/ancestriesDetails.page')
);
const AncestriesCreatePage = lazy(
  () => import('@/features/ancestries/screens/ancestriesCreate.page')
);
const AncestriesEditPage = lazy(
  () => import('@/features/ancestries/screens/ancestriesEdit.page')
);
// Character screens
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
    description: 'Campaign list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.CAMPAIGNS, RouteTags.DASHBOARD],
    component: CampaignListPage,
  },
  CAMPAIGN_DASHBOARD: {
    path: '/campaigns/:campaignId/dashboard',
    displayName: 'Campaign Dashboard',
    description: 'Campaign overview',
    permissions: [],
    slots: [],
    tags: [RouteTags.CAMPAIGNS],
    component: CampaignDashboardPage,
    build: params => `/campaigns/${params.campaignId}/dashboard`,
  },
  CAMPAIGN_MANAGEMENT: {
    path: '/campaigns/:campaignId/management',
    displayName: 'Campaign Management',
    description: 'Manage campaign',
    permissions: [], // TODO: Add GM permission check
    slots: [],
    tags: [RouteTags.CAMPAIGNS, RouteTags.EDIT],
    component: CampaignManagementPage,
    build: params => `/campaigns/${params.campaignId}/management`,
  },
  CAMPAIGN_CREATE: {
    path: '/campaigns/new',
    displayName: 'Create Campaign',
    description: 'Create a new campaign',
    permissions: [],
    slots: [],
    tags: [RouteTags.CAMPAIGNS, RouteTags.CREATE],
    component: CampaignCreatePage,
  },
  // ** ANCESTRY PAGES **
  ANCESTRIES: {
    path: '/ancestries',
    displayName: 'Ancestries',
    description: 'Ancestries list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.ANCESTRIES, RouteTags.DASHBOARD],
    component: AncestriesListPage,
  },
  ANCESTRY_DETAILS: {
    path: '/ancestries/:ancestryId',
    displayName: 'Ancestry Details',
    description: 'Ancestry details page',
    permissions: [],
    build: params => `/ancestries/${params.ancestryId}`,
    slots: [],
    tags: [RouteTags.ANCESTRIES, RouteTags.DETAILS],
    component: AncestriesDetailsPage,
  },
  ANCESTRY_CREATE: {
    path: '/ancestries/new',
    displayName: 'Create Ancestry',
    description: 'Create a new ancestry',
    permissions: [],
    slots: [],
    tags: [RouteTags.ANCESTRIES, RouteTags.CREATE],
    component: AncestriesCreatePage,
  },
  ANCESTRY_EDIT: {
    path: '/ancestries/:ancestryId/edit',
    displayName: 'Edit Ancestry',
    description: 'Edit an ancestry',
    permissions: [],
    slots: [],
    tags: [RouteTags.ANCESTRIES, RouteTags.EDIT],
    component: AncestriesEditPage,
    build: params => `/ancestries/${params.ancestryId}/edit`,
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
    tags: [RouteTags.CHARACTERS, RouteTags.DETAILS],
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
