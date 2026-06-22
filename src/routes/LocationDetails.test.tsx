import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import LocationDetails from './LocationDetails';
import locationDetailMock from '../mocks/locationDetail.mock';
import charactersMock from '../mocks/characters.mock';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <LocationDetails />,
        loader: () => ({ location: locationDetailMock, residents: charactersMock.characters.slice(0, 2) }),
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
        expect(screen.getByText('Earth (C-137)')).toBeDefined();
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
