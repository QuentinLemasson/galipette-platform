import { lazy } from 'react';
import { createBrowserRouter, redirect } from 'react-router-dom';
import { RootLayout } from './root-layout';

const HomePage = lazy(() => import('./screens/HomePage.tsx'));
const DashboardPage = lazy(() => import('./screens/DashboardPage.tsx'));
const CharactersPage = lazy(() => import('./screens/CharactersPage.tsx'));
const CharacterDetailsPage = lazy(
  () => import('./screens/CharacterDetailsPage.tsx')
);
const ErrorCodePage = lazy(() => import('./screens/ErrorCodePage.tsx'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        loader: () => redirect('/home'),
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'characters',
        element: <CharactersPage />,
      },
      {
        path: 'characters/:characterId',
        element: <CharacterDetailsPage />,
      },
      {
        path: ':errorCode',
        element: <ErrorCodePage />,
      },
    ],
  },
]);
