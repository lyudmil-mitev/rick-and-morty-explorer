import { describe, it, expect } from 'vitest';
import { render, screen, within } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Characters from './Characters';
import charactersMock from '../mocks/characters.mock';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Characters />,
        loader: () => charactersMock,
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

    it('should have characters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick Sanchez')).toBeDefined();
        expect(screen.getByText('Summer Smith')).toBeDefined();
    });

    it('should have pagination', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByLabelText('Page')).toHaveLength(2);
        expect(screen.getAllByDisplayValue('1')).toHaveLength(2);
        expect(screen.getAllByText(`of ${charactersMock.pages}`)).toHaveLength(2);
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        const mainNav = screen.getByRole('navigation', { name: 'Main sections' });

        expect(within(mainNav).getByRole('link', { name: 'Characters' }).getAttribute('href')).toBe('/characters');
        expect(within(mainNav).getByRole('link', { name: 'Episodes' }).getAttribute('href')).toBe('/episodes');
        expect(within(mainNav).getByRole('link', { name: 'Locations' }).getAttribute('href')).toBe('/locations');
        expect(within(mainNav).getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about');
    });

    it('should have footer navigation links', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        const footerNav = screen.getByRole('navigation', { name: 'Footer navigation' });

        expect(within(footerNav).getByRole('link', { name: 'Characters' }).getAttribute('href')).toBe('/characters');
        expect(within(footerNav).getByRole('link', { name: 'Episodes' }).getAttribute('href')).toBe('/episodes');
        expect(within(footerNav).getByRole('link', { name: 'Locations' }).getAttribute('href')).toBe('/locations');
        expect(within(footerNav).getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about');
    });
});
