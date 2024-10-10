import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

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
        expect(screen.getByText('Rick and Morty Explorer')).toBeDefined();
    });

    it('should have characters', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick Sanchez')).toBeDefined();
        expect(screen.getByText('Summer Smith')).toBeDefined();
    });

    it('should have pagination', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText(`Page 1 of ${charactersMock.pages}`)).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});