/**
 * RootLayout — shared shell for all routes.
 *
 * Nav links derive from `PAGES` to avoid hard-coded paths.
 * Wraps route elements in Suspense to support lazy-loading.
 */
import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { getPagesBySlot, PAGES } from './config/pages';
import { RouteSlot } from '../types/routes.types';

/**
 * App shell providing header, navigation and content outlet.
 *
 * @returns Application layout with shared UI elements.
 */
export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          <Link to={PAGES.HOME.path} className="font-semibold">
            Galipette Portal
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {getPagesBySlot(RouteSlot.NAVBAR).map(page => (
              <NavLink
                to={page.path}
                className={({ isActive }) => (isActive ? 'underline' : '')}
              >
                {page.displayName}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-3 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Galipette Cendree
        </div>
      </footer>
    </div>
  );
}
