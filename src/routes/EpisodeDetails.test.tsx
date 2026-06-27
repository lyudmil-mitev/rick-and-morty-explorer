import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import EpisodeDetails from './EpisodeDetails';
import episodeDetailMock from '../mocks/episodeDetail.mock';
import charactersMock from '../mocks/characters.mock';
import type { DetailsRecord } from '../details';

const details: DetailsRecord = {
    id: 1,
    status: 'ok',
    textType: 'synopsis',
    wikiTitle: 'Pilot',
    wikiUrl: 'https://rickandmorty.fandom.com/wiki/Pilot',
    text: 'Rick takes Morty on a trip through another dimension.',
    sources: [{
        id: 'episodes-1-wiki',
        title: 'Pilot',
        url: 'https://rickandmorty.fandom.com/wiki/Pilot',
        publisher: 'Rick and Morty Wiki',
        sourceType: 'wiki',
        retrievedAt: '2026-06-26T22:31:04.379Z',
    }],
    notes: '',
};

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <EpisodeDetails />,
        loader: () => ({ episode: episodeDetailMock, characters: charactersMock.characters.slice(0, 2), details })
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

    it('should have episode', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByRole('heading', { level: 1, name: 'Pilot' })).toBeDefined();
    });

    it('should have synopsis with sources', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByRole('heading', { level: 2, name: 'Synopsis' })).toBeDefined();
        expect(screen.getByText('Rick takes Morty on a trip through another dimension.')).toBeDefined();
        expect(screen.getByRole('link', { name: 'Pilot' }).getAttribute('href')).toBe('https://rickandmorty.fandom.com/wiki/Pilot');
    });

    it('should have related characters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick Sanchez')).toBeDefined();
        expect(screen.getByText('Morty Smith')).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});
