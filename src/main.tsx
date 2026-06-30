import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { charactersLoader, characterDetailLoader, episodesLoader, episodeDetailLoader, locationsLoader, locationDetailLoader } from './loaders.ts'

import Root from './routes/Root.tsx'
import Characters from './routes/Characters.tsx'
import Episodes from './routes/Episodes.tsx'
import Locations from './routes/Locations.tsx'
import './index.css'
import CharacterDetails from './routes/CharacterDetails.tsx'
import EpisodeDetails from './routes/EpisodeDetails.tsx'
import LocationDetails from './routes/LocationDetails.tsx'
import ErrorPage from './routes/ErrorPage.tsx'
import About from './routes/About.tsx'
import HomeSplash from './routes/HomeSplash.tsx'
import LoadingSpinner from './components/LoadingSpinner.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    hydrateFallbackElement: (
      <main className="flex min-h-screen items-center justify-center bg-[#eef2ed] text-slate-950 dark:bg-[#070b18] dark:text-white">
        <LoadingSpinner />
      </main>
    ),
    children: [
      {
        index: true,
        element: <HomeSplash />,
        handle: { splash: true },
      },
      {
        path: '/characters',
        element: <Characters />,
        loader: charactersLoader,
      },
      {
        path: '/characters/:characterId',
        element: <CharacterDetails />,
        loader: characterDetailLoader
      },
      {
        path: '/locations',
        element: <Locations />,
        loader: locationsLoader,
      },
      {
        path: '/locations/:locationId',
        element: <LocationDetails />,
        loader: locationDetailLoader
      },
      {
        path: '/episodes',
        element: <Episodes />,
        loader: episodesLoader,
      },
      {
        path: '/episodes/:episodeId',
        element: <EpisodeDetails />,
        loader: episodeDetailLoader
      },
      {
        path: '/about',
        element: <About />,
      },
    ]
  },
], { basename: '/rick-and-morty-explorer' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
