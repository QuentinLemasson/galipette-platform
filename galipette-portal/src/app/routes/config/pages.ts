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
// Rules feature screens
const DamageTypesPage = lazy(
  () => import('../screens/DamageTypesPage')
);
const AfflictionsPage = lazy(
  () => import('../screens/AfflictionsPage')
);
// Magic items feature screens
const MagicItemsListPage = lazy(
  () => import('@/features/magicItems/screens/magicItemsList.page')
);
const MagicItemsDetailsPage = lazy(
  () => import('@/features/magicItems/screens/magicItemsDetails.page')
);
const MagicItemsCreatePage = lazy(
  () => import('@/features/magicItems/screens/magicItemsCreate.page')
);
const MagicItemsEditPage = lazy(
  () => import('@/features/magicItems/screens/magicItemsEdit.page')
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
  // ** MAGIC ITEM PAGES **
  MAGIC_ITEMS: {
    path: '/magic-items',
    displayName: 'Objets magiques',
    description: 'Liste des objets magiques',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.MAGIC_ITEMS, RouteTags.DASHBOARD],
    component: MagicItemsListPage,
  },
  MAGIC_ITEM_DETAILS: {
    path: '/magic-items/:magicItemId',
    displayName: 'Detail objet magique',
    description: 'Fiche objet magique',
    permissions: [],
    slots: [],
    tags: [RouteTags.MAGIC_ITEMS, RouteTags.DETAILS],
    component: MagicItemsDetailsPage,
    build: params => `/magic-items/${params.magicItemId}`,
  },
  MAGIC_ITEM_CREATE: {
    path: '/magic-items/new',
    displayName: 'Creer un objet magique',
    description: 'Creer un nouvel objet magique',
    permissions: [],
    slots: [],
    tags: [RouteTags.MAGIC_ITEMS, RouteTags.CREATE],
    component: MagicItemsCreatePage,
  },
  MAGIC_ITEM_EDIT: {
    path: '/magic-items/:magicItemId/edit',
    displayName: 'Modifier objet magique',
    description: 'Modifier un objet magique',
    permissions: [],
    slots: [],
    tags: [RouteTags.MAGIC_ITEMS, RouteTags.EDIT],
    component: MagicItemsEditPage,
    build: params => `/magic-items/${params.magicItemId}/edit`,
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
  // ** RULES PAGES **
  DAMAGE_TYPES: {
    path: '/rules/damage-types',
    displayName: 'Types de degats',
    description: 'Damage types list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.RULES],
    component: DamageTypesPage,
  },
  AFFLICTIONS: {
    path: '/rules/afflictions',
    displayName: 'Afflictions',
    description: 'Afflictions list',
    permissions: [],
    slots: [RouteSlot.NAVBAR],
    tags: [RouteTags.RULES],
    component: AfflictionsPage,
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
