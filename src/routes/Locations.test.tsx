import { describe, it, expect } from 'vitest';
import { render, screen, within } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import locationsMock from '../mocks/locations.mock';
import Locations from './Locations';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Locations />,
        loader: () => locationsMock,
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

    it('should have locations', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Abadango')).toBeDefined();
        expect(screen.getByText('Anatomy Park')).toBeDefined();
    });

    it('should have pagination', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByLabelText('Page')).toHaveLength(1);
        expect(screen.getAllByDisplayValue('1')).toHaveLength(1);
        expect(screen.getAllByText(`of ${locationsMock.pages}`)).toHaveLength(1);
    });

    it('should render location type and dimension as dropdown filters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)

        const typeFilters = screen.getAllByLabelText('Type');
        const dimensionFilters = screen.getAllByLabelText('Dimension');

        expect(typeFilters[0]).toBeInstanceOf(HTMLSelectElement);
        expect(dimensionFilters[0]).toBeInstanceOf(HTMLSelectElement);
        expect(within(typeFilters[0]).getByRole('option', { name: 'Planet' })).toBeDefined();
        expect(within(dimensionFilters[0]).getByRole('option', { name: 'Dimension C-137' })).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});
