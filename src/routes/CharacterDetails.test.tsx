import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import CharacterDetails from './CharacterDetails';
import characterDetailMock from '../mocks/characterDetail.mock';
import episodesMock from '../mocks/episodes.mock';
import type { DetailsRecord } from '../details';

const details: DetailsRecord = {
    id: 1,
    status: 'ok',
    textType: 'description',
    wikiTitle: 'Rick Sanchez',
    wikiUrl: 'https://rickandmorty.fandom.com/wiki/Rick_Sanchez',
    text: 'Rick is a genius scientist from Dimension C-137.',
    sources: [{
        id: 'characters-1-wiki',
        title: 'Rick Sanchez',
        url: 'https://rickandmorty.fandom.com/wiki/Rick_Sanchez',
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
        element: <CharacterDetails />,
        loader: () => ({ character: characterDetailMock, episodes: episodesMock.episodes.slice(0, 2), details }),
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
        expect(screen.getByRole('heading', { level: 1, name: 'Rick Sanchez' })).toBeDefined();
    });

    it('should have details with sources', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByRole('heading', { level: 2, name: 'Description' })).toBeDefined();
        expect(screen.getByText('Rick is a genius scientist from Dimension C-137.')).toBeDefined();
        expect(screen.getByRole('link', { name: 'Rick Sanchez' }).getAttribute('href')).toBe('https://rickandmorty.fandom.com/wiki/Rick_Sanchez');
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
