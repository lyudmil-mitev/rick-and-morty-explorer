import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";

import Root from './Root';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import Characters from './Characters';
import ErrorPage from './ErrorPage';

const mockRoutes = [{
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Characters />,
        errorElement: <ErrorPage />,
        loader: () => { throw new Error('Force error page') },
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

    it('should have error message', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getByText("Looks like something went wrong!")).toBeDefined();
        expect(screen.getByText("Go Back")).toBeDefined();
    })


    it('should have tabs', async () => {
        render(<RouterProvider router={router}></RouterProvider>)
        expect(screen.getAllByText('Characters')).toBeDefined();
        expect(screen.getAllByText('Episodes')).toBeDefined();
        expect(screen.getAllByText('Locations')).toBeDefined();
    });
});