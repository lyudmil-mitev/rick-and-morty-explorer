import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';

import Pagination from './Pagination';

function PaginationHarness({ page, totalPages }: { page: number, totalPages: number }) {
    const location = useLocation();

    return (
        <>
            <Pagination page={page} totalPages={totalPages} />
            <p data-testid="location-search">{location.search}</p>
        </>
    );
}

function renderPagination(page = 2, totalPages = 5) {
    const router = createMemoryRouter([
        {
            path: '/',
            element: <PaginationHarness page={page} totalPages={totalPages} />,
        },
    ], { initialEntries: [`/?page=${page}`] });

    render(<RouterProvider router={router} />);
}

describe('Pagination', () => {
    it('navigates to a typed page on submit and clamps out-of-range values', async () => {
        renderPagination(2, 5);

        const input = screen.getByLabelText('Page');
        fireEvent.change(input, { target: { value: '99' } });
        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=5');
        });
    });

    it('updates the route when the native number control changes the page', async () => {
        renderPagination(2, 5);

        const input = screen.getByLabelText('Page') as HTMLInputElement;
        input.getBoundingClientRect = () => ({
            x: 0,
            y: 0,
            width: 80,
            height: 40,
            top: 0,
            right: 80,
            bottom: 40,
            left: 0,
            toJSON: () => ({}),
        });

        fireEvent.pointerDown(input, { clientX: 70 });
        fireEvent.change(input, { target: { value: '3' } });

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=3');
        });
    });

    it('keeps first and last page chevrons disabled at the boundaries', () => {
        renderPagination(1, 1);

        expect(screen.getByLabelText('Previous page').getAttribute('aria-disabled')).toBe('true');
        expect(screen.getByLabelText('Next page').getAttribute('aria-disabled')).toBe('true');
    });
});
