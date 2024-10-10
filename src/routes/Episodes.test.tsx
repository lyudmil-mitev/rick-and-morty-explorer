import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import episodesMock from '../mocks/episodes.mock';
import Episodes from './Episodes';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Episodes />,
        loader: () => episodesMock,
      },
    ]
}];

describe('Root', () => {
    const router = createMemoryRouter(mockRoutes);
    it('should have heading title', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Rick and Morty Explorer')).toBeDefined();
    });

    it('should have episodes', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText('Pilot')).toBeDefined();
        expect(screen.getByText('A Rickle in Time')).toBeDefined();
    });

    it('should have pagination', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText(`Page 1 of ${episodesMock.pages}`)).toBeDefined();
    });

    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});