import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LocationDetails from './LocationDetails';
import locationDetailMock from '../mocks/locationDetail.mock';
import charactersMock from '../mocks/characters.mock';
import type { DetailsRecord } from '../details';

const details: DetailsRecord = {
    id: 1,
    status: 'contextual_source',
    textType: 'description',
    wikiTitle: 'Earth (C-137)',
    wikiUrl: 'https://rickandmorty.fandom.com/wiki/Earth_(C-137)',
    text: "Earth (C-137) is Rick and Morty's home reality.",
    sources: [{
        id: 'locations-1-wiki',
        title: 'Earth (C-137)',
        url: 'https://rickandmorty.fandom.com/wiki/Earth_(C-137)',
        publisher: 'Rick and Morty Wiki',
        sourceType: 'wiki',
        retrievedAt: '2026-06-26T22:31:04.379Z',
    }],
    notes: 'This record uses a contextual wiki source.',
};

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <LocationDetails />,
        loader: () => ({ location: locationDetailMock, residents: charactersMock.characters.slice(0, 2), details }),
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

    it('should have location', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByRole('heading', { level: 1, name: 'Earth (C-137)' })).toBeDefined();
    });

    it('should have contextual details with sources', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByRole('heading', { level: 2, name: 'Description' })).toBeDefined();
        expect(screen.getByText('Context source')).toBeDefined();
        expect(screen.getByText("Earth (C-137) is Rick and Morty's home reality.")).toBeDefined();
        expect(screen.getByText('This record uses a contextual wiki source.')).toBeDefined();
        expect(screen.getByRole('link', { name: 'Earth (C-137)' }).getAttribute('href')).toBe('https://rickandmorty.fandom.com/wiki/Earth_(C-137)');
    });

    it('should have related residents', async () => {
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
