import { describe, it, expect } from 'vitest';
import { fireEvent, render, screen, within } from "@testing-library/react";

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

    it('should replay the banner title animation', async () => {
        render(<RouterProvider router={router}></RouterProvider>)

        const titleReplay = screen.getByRole('button', { name: 'Replay title animation' });

        expect(titleReplay.getAttribute('data-title-zap-version')).toBe('0');

        fireEvent.click(titleReplay);
        expect(titleReplay.getAttribute('data-title-zap-version')).toBe('1');
    });

    it('should have characters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick Sanchez')).toBeDefined();
        expect(screen.getByText('Summer Smith')).toBeDefined();
    });

    it('should have pagination', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByLabelText('Page')).toHaveLength(1);
        expect(screen.getAllByDisplayValue('1')).toHaveLength(1);
        expect(screen.getAllByText(`of ${charactersMock.pages}`)).toHaveLength(1);
    });

    it('should render character species and type as dropdown filters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)

        const speciesFilters = screen.getAllByLabelText('Species');
        const typeFilters = screen.getAllByLabelText('Type');

        expect(speciesFilters[0]).toBeInstanceOf(HTMLSelectElement);
        expect(typeFilters[0]).toBeInstanceOf(HTMLSelectElement);
        expect(within(speciesFilters[0]).getByRole('option', { name: 'Human' })).toBeDefined();
        expect(within(typeFilters[0]).getByRole('option', { name: 'Parasite' })).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        const mainNav = screen.getByRole('navigation', { name: 'Main sections' });

        expect(within(mainNav).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
        expect(within(mainNav).getByRole('link', { name: 'Characters' }).getAttribute('href')).toBe('/characters');
        expect(within(mainNav).getByRole('link', { name: 'Episodes' }).getAttribute('href')).toBe('/episodes');
        expect(within(mainNav).getByRole('link', { name: 'Locations' }).getAttribute('href')).toBe('/locations');
        expect(within(mainNav).getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about');
    });

    it('should have footer navigation links', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        const footerNav = screen.getByRole('navigation', { name: 'Footer navigation' });

        expect(within(footerNav).getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
        expect(within(footerNav).getByRole('link', { name: 'Characters' }).getAttribute('href')).toBe('/characters');
        expect(within(footerNav).getByRole('link', { name: 'Episodes' }).getAttribute('href')).toBe('/episodes');
        expect(within(footerNav).getByRole('link', { name: 'Locations' }).getAttribute('href')).toBe('/locations');
        expect(within(footerNav).getByRole('link', { name: 'About' }).getAttribute('href')).toBe('/about');
    });
});
