/**
 * useNavigation — Declarative navigation derived from PAGES.
 *
 * Provides:
 * - pages: enriched route objects with active state and helpers
 * - go/replace: navigate using a RouteConfig + optional params
 * - history helpers: back/forward
 * - currentPath: current location pathname
 *
 * Usage examples:
 *   const nav = useNavigation();
 *   nav.go(PAGES.HOME);
 *   nav.go(PAGES.CHARACTER_DETAILS, { characterId: '123' });
 */
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { PAGES } from '@/app/routes/config/pages';
import type { RouteConfig, RouteParams } from '@/app/types/routes';
import type { NavigationApi, NavigationRoute } from '@/common/types/navigation';

/**
 * Build a concrete path for a given route.
 * Falls back to the route's static path if no builder is provided.
 *
 * @param page Route configuration (from PAGES)
 * @param params Optional params for dynamic routes
 * @returns A concrete pathname
 */
function toPath(page: RouteConfig, params?: RouteParams) {
  if (page.build) return page.build(params ?? {});
  return page.path;
}

/**
 * React hook exposing a declarative navigation API derived from PAGES.
 *
 * @returns NavigationApi with enriched pages and helpers
 */
export function useNavigation(): NavigationApi {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Enrich a RouteConfig with navigation helpers and active state.
   *
   * @param page Route configuration to enrich
   * @returns NavigationRoute with helpers and flags
   */
  const deriveRoute = (page: RouteConfig): NavigationRoute => {
    const isActive = !!matchPath(
      { path: page.path, end: true },
      location.pathname
    );
    const isActiveStart = !!matchPath(
      { path: page.path, end: false },
      location.pathname
    );

    return {
      ...page,
      /** Navigate to the route. For dynamic routes, pass params. */
      navigate: (params?: RouteParams) => navigate(toPath(page, params)),
      /** Replace the current history entry instead of pushing a new one. */
      replace: (params?: RouteParams) =>
        navigate(toPath(page, params), { replace: true }),
      isActive,
      isActiveStart,
    };
  };

  const pages = Object.fromEntries(
    Object.entries(PAGES).map(([key, page]) => [key, deriveRoute(page)])
  ) as NavigationApi['pages'];

  return {
    pages,
    /** Navigate to a given route, optionally with params. */
    go: (page, params) => navigate(toPath(page, params)),
    /** Replace current history entry with a given route. */
    replace: (page, params) =>
      navigate(toPath(page, params), { replace: true }),
    /** Navigate back in history. */
    goBack: () => navigate(-1),
    /** Navigate forward in history. */
    goForward: () => navigate(1),
    currentPath: location.pathname,
  };
}
