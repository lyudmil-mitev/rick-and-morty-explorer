import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';

import PaginatedGrid from './PaginatedGrid';

function PaginatedGridHarness() {
    const location = useLocation();

    return (
        <>
            <PaginatedGrid pages={3} title="Characters" description="Swipe through records.">
                <article>Rick Sanchez</article>
            </PaginatedGrid>
            <p data-testid="location-search">{location.search}</p>
        </>
    );
}

function renderPaginatedGrid(initialPage = 1) {
    const router = createMemoryRouter([
        {
            path: '/',
            element: <PaginatedGridHarness />,
        },
    ], { initialEntries: [`/?page=${initialPage}`] });

    render(<RouterProvider router={router} />);
}

describe('PaginatedGrid', () => {
    it('navigates to the next page on left swipe', async () => {
        renderPaginatedGrid(1);

        const list = screen.getByRole('region', { name: 'Characters list' });
        fireEvent.touchStart(list, { touches: [{ clientX: 260, clientY: 120 }] });
        fireEvent.touchEnd(list, { changedTouches: [{ clientX: 120, clientY: 130 }] });

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=2');
        });
    });

    it('moves the card grid subtly during horizontal drag', () => {
        renderPaginatedGrid(1);

        const list = screen.getByRole('region', { name: 'Characters list' });
        const grid = screen.getByTestId('paginated-grid-cards');

        fireEvent.touchStart(list, { touches: [{ clientX: 260, clientY: 120 }] });
        fireEvent.touchMove(list, { touches: [{ clientX: 160, clientY: 126 }] });

        expect(grid.getAttribute('style')).toContain('translateX(-34px)');
    });

    it('does not move the grid when swiping beyond pagination edges', () => {
        renderPaginatedGrid(1);

        const list = screen.getByRole('region', { name: 'Characters list' });
        const grid = screen.getByTestId('paginated-grid-cards');

        fireEvent.touchStart(list, { touches: [{ clientX: 120, clientY: 120 }] });
        fireEvent.touchMove(list, { touches: [{ clientX: 260, clientY: 126 }] });

        expect(grid.getAttribute('style') ?? '').not.toContain('translateX');
    });

    it('navigates to the previous page on right swipe', async () => {
        renderPaginatedGrid(2);

        const list = screen.getByRole('region', { name: 'Characters list' });
        fireEvent.touchStart(list, { touches: [{ clientX: 120, clientY: 120 }] });
        fireEvent.touchEnd(list, { changedTouches: [{ clientX: 260, clientY: 130 }] });

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=1');
        });
    });

    it('ignores vertical scroll gestures and page boundaries', () => {
        renderPaginatedGrid(1);

        const list = screen.getByRole('region', { name: 'Characters list' });
        fireEvent.touchStart(list, { touches: [{ clientX: 120, clientY: 120 }] });
        fireEvent.touchEnd(list, { changedTouches: [{ clientX: 260, clientY: 260 }] });

        expect(screen.getByTestId('location-search').textContent).toBe('?page=1');

        fireEvent.touchStart(list, { touches: [{ clientX: 120, clientY: 120 }] });
        fireEvent.touchEnd(list, { changedTouches: [{ clientX: 260, clientY: 130 }] });

        expect(screen.getByTestId('location-search').textContent).toBe('?page=1');
    });
});
