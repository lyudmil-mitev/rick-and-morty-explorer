import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { charactersLoader, characterDetailLoader, episodesLoader, episodeDetailLoader, locationsLoader, locationDetailLoader } from './loaders.ts'

import Root from './routes/Root.tsx'
import Characters from './routes/Characters.tsx'
import CharacterDetail from './components/CharacterDetail.tsx'
import EpisodeDetail from './components/EpisodeDetail.tsx'
import Episodes from './routes/Episodes.tsx'
import Locations from './routes/Locations.tsx'
import LocationDetail from './components/LocationDetail.tsx'
import './index.css'

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
        element: <CharacterDetail />,
        loader: characterDetailLoader
      },
      {
        path: '/locations',
        element: <Locations />,
        loader: locationsLoader,
      },
      {
        path: '/locations/:locationId',
        element: <LocationDetail />,
        loader: locationDetailLoader
      },
      {
        path: '/episodes',
        element: <Episodes />,
        loader: episodesLoader,
      },
      {
        path: '/episodes/:episodeId',
        element: <EpisodeDetail />,
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
