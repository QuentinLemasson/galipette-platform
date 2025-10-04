/**
 * RootLayout — shared shell for all routes.
 *
 * Nav links derive from `PAGES` to avoid hard-coded paths.
 * Wraps route elements in Suspense to support lazy-loading.
 */
import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { PAGES } from './config/pages';

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
            <NavLink
              to={PAGES.HOME.path}
              className={({ isActive }) => (isActive ? 'underline' : '')}
            >
              Home
            </NavLink>
            <NavLink
              to={PAGES.DASHBOARD.path}
              className={({ isActive }) => (isActive ? 'underline' : '')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to={PAGES.CHARACTERS.path}
              className={({ isActive }) => (isActive ? 'underline' : '')}
            >
              Characters
            </NavLink>
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
