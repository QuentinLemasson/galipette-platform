/**
 * App router — data router built from the PAGES config.
 *
 * - Uses lazy-loaded route elements for code-splitting
 * - Derives all paths from `PAGES` to keep a single source of truth
 * - Redirects "/" to HOME
 */
import { createBrowserRouter, redirect } from 'react-router-dom';
import { RootLayout } from './root-layout';
import { PAGES } from './config/pages';

/**
 * Global application router instance.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, loader: () => redirect(PAGES.HOME.path) },
      ...Object.values(PAGES).map(page => ({
        path: page.path.replace(/^\//, ''),
        element: <page.component />,
      })),
    ],
  },
]);
