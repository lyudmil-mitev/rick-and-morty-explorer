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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Characters />,
        errorElement: <ErrorPage />,
        loader: charactersLoader,
      },
      {
        path: '/characters',
        element: <Characters />,
        errorElement: <ErrorPage />,
        loader: charactersLoader,
      },
      {
        path: '/characters/:characterId',
        element: <CharacterDetails />,
        errorElement: <ErrorPage />,
        loader: characterDetailLoader
      },
      {
        path: '/locations',
        element: <Locations />,
        errorElement: <ErrorPage />,
        loader: locationsLoader,
      },
      {
        path: '/locations/:locationId',
        element: <LocationDetails />,
        errorElement: <ErrorPage />,
        loader: locationDetailLoader
      },
      {
        path: '/episodes',
        element: <Episodes />,
        errorElement: <ErrorPage />,
        loader: episodesLoader,
      },
      {
        path: '/episodes/:episodeId',
        element: <EpisodeDetails />,
        errorElement: <ErrorPage />,
        loader: episodeDetailLoader
      },
    ]
  },
], { basename: '/rick-and-morty-explorer' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
