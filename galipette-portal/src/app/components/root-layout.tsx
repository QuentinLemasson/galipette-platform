/**
 * RootLayout — shared shell for all routes.
 *
 * Nav links derive from `PAGES` to avoid hard-coded paths.
 * Wraps route elements in Suspense to support lazy-loading.
 */
import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { getPagesBySlot, PAGES } from '../routes/config/pages';
import { RouteSlot, RouteTags } from '../types/routes.types';
import { PreferencesDropdown, ThemeToggleButton } from '@/common/components';
import { Separator } from '@/common/ui';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/common/ui';
import { cn } from '@/common/utils';

/**
 * App shell providing header, navigation and content outlet.
 *
 * @returns Application layout with shared UI elements.
 */
export function RootLayout() {
  const location = useLocation();
  const navbarPages = getPagesBySlot(RouteSlot.NAVBAR);
  const rulePages = navbarPages.filter(page => page.tags.includes(RouteTags.RULES));
  const topLevelPages = navbarPages.filter(
    page => !page.tags.includes(RouteTags.RULES)
  );

  /**
   * Checks if a navigation link should be marked as active.
   * A link is active if the current path starts with the link path.
   *
   * Examples:
   * - /ancestries, /ancestries/new, /ancestries/2/details → ancestries is active
   * - /campaigns, /campaigns/5/dashboard → campaigns is active
   */
  const isLinkActive = (linkPath: string): boolean => {
    return location.pathname.startsWith(linkPath);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              to={PAGES.HOME.path}
              className="font-semibold text-lg text-foreground hover:text-primary transition-colors"
            >
              Galipette Portal
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <NavigationMenu>
              <NavigationMenuList>
                {topLevelPages.map(page => {
                  const isActive = isLinkActive(page.path);
                  return (
                    <NavigationMenuItem key={page.path}>
                      <Link to={page.path}>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            isActive &&
                              'bg-accent text-accent-foreground font-medium'
                          )}
                        >
                          {page.displayName}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  );
                })}
                {rulePages.length > 0 && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        rulePages.some(page => isLinkActive(page.path)) &&
                          'bg-accent text-accent-foreground font-medium'
                      )}
                    >
                      Règles
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[800px]">
                      <ul className="grid min-w-[240px] gap-1">
                        {rulePages.map(page => (
                          <li key={page.path}>
                            <Link to={page.path}>
                              <NavigationMenuLink className="space-y-1 p-3 leading-none">
                                <div className="text-sm font-medium leading-none">
                                  {page.displayName}
                                </div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {page.description}
                                </p>
                              </NavigationMenuLink>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggleButton />
            <PreferencesDropdown />
          </div>
        </div>
      </header>
      <main className="flex-1 bg-background">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-6">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Galipette Cendree
        </div>
      </footer>
    </div>
  );
}
