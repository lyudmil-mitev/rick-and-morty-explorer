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

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    // errorElement: <h1>404 Not Found</h1>, // TODO
    children: [
      {
        index: true,
        element: <Characters />,
        loader: charactersLoader,
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
    ]
  },
], { basename: '/rick-and-morty-explorer' })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
