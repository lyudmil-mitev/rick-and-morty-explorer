import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation, useRouteError } from 'react-router-dom';

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

function ErrorBoundary() {
    const error = useRouteError();
    return <p>{error instanceof Error ? error.message : 'Error'}</p>;
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

    it('waits for form submit before navigating to a typed page', async () => {
        renderPagination(2, 5);

        const input = screen.getByLabelText('Page') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '3' } });

        expect(screen.getByTestId('location-search').textContent).toBe('?page=2');

        fireEvent.submit(input.closest('form')!);

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=3');
        });
    });

    it('resets invalid page input on submit', () => {
        renderPagination(2, 5);

        const input = screen.getByLabelText('Page') as HTMLInputElement;
        fireEvent.change(input, { target: { value: '' } });
        fireEvent.submit(input.closest('form')!);

        expect(input.value).toBe('2');
        expect(screen.getByTestId('location-search').textContent).toBe('?page=2');
    });

    it('keeps first and last page chevrons disabled at the boundaries', () => {
        renderPagination(1, 1);

        expect(screen.getByLabelText('Previous page').getAttribute('aria-disabled')).toBe('true');
        expect(screen.getByLabelText('Next page').getAttribute('aria-disabled')).toBe('true');
    });

    it('throws for invalid rendered pages', async () => {
        const router = createMemoryRouter([
            {
                path: '/',
                element: <PaginationHarness page={0} totalPages={5} />,
                errorElement: <ErrorBoundary />,
            },
        ]);

        render(<RouterProvider router={router} />);

        expect(await screen.findByText('Page not found')).toBeDefined();
    });
});
