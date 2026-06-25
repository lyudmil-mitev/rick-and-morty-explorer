import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router-dom';

import FilterPanel, { FilterField } from './FilterPanel';

const fields: FilterField[] = [
    { name: 'name', label: 'Name', control: 'text' },
    {
        name: 'status',
        label: 'Status',
        control: 'select',
        options: [
            { label: 'Alive', value: 'alive' },
            { label: 'Dead', value: 'dead' },
        ],
    },
];

function FilterHarness() {
    const location = useLocation();

    return (
        <>
            <FilterPanel fields={fields} />
            <p data-testid="location-search">{location.search}</p>
        </>
    );
}

function renderFilterPanel(initialSearch = '') {
    const router = createMemoryRouter([
        {
            path: '/characters',
            element: <FilterHarness />,
        },
    ], { initialEntries: [`/characters${initialSearch}`] });

    render(<RouterProvider router={router} />);
}

describe('FilterPanel', () => {
    it('applies non-empty filters and resets to page 1', async () => {
        renderFilterPanel('?page=4');

        fireEvent.change(screen.getAllByLabelText('Name')[0], { target: { value: 'Rick' } });
        fireEvent.change(screen.getAllByLabelText('Status')[0], { target: { value: 'dead' } });
        fireEvent.submit(screen.getAllByText('Apply')[0].closest('form')!);

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?name=Rick&status=dead&page=1');
        });
    });

    it('reflects active URL filters and clears them', async () => {
        renderFilterPanel('?status=alive&page=2');

        expect(screen.getAllByText('Status: Alive')).toHaveLength(2);

        fireEvent.click(screen.getAllByText('Clear')[0]);

        await waitFor(() => {
            expect(screen.getByTestId('location-search').textContent).toBe('?page=1');
        });
    });
});
