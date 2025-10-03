/**
 * App router — data router built from the PAGES config.
 *
 * - Uses lazy-loaded route elements for code-splitting
 * - Derives all paths from `PAGES` to keep a single source of truth
 * - Redirects "/" to HOME
 */
import { lazy } from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { RootLayout } from './root-layout';
import { PAGES } from './config/pages';

const HomePage = lazy(() => import('./screens/HomePage.tsx'));
const DashboardPage = lazy(() => import('./screens/DashboardPage.tsx'));
const CharactersPage = lazy(() => import('./screens/CharactersPage.tsx'));
const CharacterDetailsPage = lazy(
  () => import('./screens/CharacterDetailsPage.tsx')
);
const ErrorCodePage = lazy(() => import('./screens/ErrorCodePage.tsx'));

/**
 * Global application router instance.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, loader: () => redirect(PAGES.HOME.path) },
      { path: PAGES.HOME.path.replace(/^\//, ''), element: <HomePage /> },
      {
        path: PAGES.DASHBOARD.path.replace(/^\//, ''),
        element: <DashboardPage />,
      },
      {
        path: PAGES.CHARACTERS.path.replace(/^\//, ''),
        element: <CharactersPage />,
      },
      {
        path: PAGES.CHARACTER_DETAILS.path.replace(/^\//, ''),
        element: <CharacterDetailsPage />,
      },
      {
        path: PAGES.ERROR_CODE.path.replace(/^\//, ''),
        element: <ErrorCodePage />,
      },
    ],
  },
]);
