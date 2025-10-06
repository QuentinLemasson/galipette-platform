/**
 * RootLayout — shared shell for all routes.
 *
 * Nav links derive from `PAGES` to avoid hard-coded paths.
 * Wraps route elements in Suspense to support lazy-loading.
 */
import { Suspense } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { getPagesBySlot, PAGES } from '../routes/config/pages';
import { RouteSlot } from '../types/routes.types';
import { PreferencesDropdown, ThemeToggleButton } from '@/common/components';
import { Separator } from '@/common/ui';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/common/ui';

/**
 * App shell providing header, navigation and content outlet.
 *
 * @returns Application layout with shared UI elements.
 */
export function RootLayout() {
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
                {getPagesBySlot(RouteSlot.NAVBAR).map(page => (
                  <NavigationMenuItem key={page.path}>
                    <Link to={page.path}>
                      <NavigationMenuLink
                        className={navigationMenuTriggerStyle()}
                      >
                        {page.displayName}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
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
