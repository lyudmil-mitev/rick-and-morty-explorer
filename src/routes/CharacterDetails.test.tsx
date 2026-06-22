import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CharacterDetails from './CharacterDetails';
import characterDetailMock from '../mocks/characterDetail.mock';
import episodesMock from '../mocks/episodes.mock';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <CharacterDetails />,
        loader: () => ({ character: characterDetailMock, episodes: episodesMock.episodes.slice(0, 2) }),
      },
    ]
}];

describe('Root', () => {
    const router = createMemoryRouter(mockRoutes);
    it('should have heading title', async () => {
        render(
            <RouterProvider router={router}>
            </RouterProvider>
        )
        expect(screen.getByRole('heading', { level: 1, name: 'Rick and Morty Explorer' })).toBeDefined();
    });

    it('should have character', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick Sanchez')).toBeDefined();
    });

    it('should have related episodes', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Pilot')).toBeDefined();
        expect(screen.getByText('Lawnmower Dog')).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});
