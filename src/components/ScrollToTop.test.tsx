import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, Link, RouterProvider } from 'react-router-dom';

import ScrollToTop from './ScrollToTop';

function ScrollHarness() {
    return (
        <>
            <ScrollToTop />
            <Link to="/characters/1">Character</Link>
            <Link to="/characters?page=2">Page 2</Link>
        </>
    );
}

function renderScrollHarness(initialPath = '/characters') {
    const router = createMemoryRouter([
        {
            path: '*',
            element: <ScrollHarness />,
        },
    ], { initialEntries: [initialPath] });

    render(<RouterProvider router={router} />);
}

describe('ScrollToTop', () => {
    it('scrolls to top on pathname changes', () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        renderScrollHarness();

        fireEvent.click(screen.getByRole('link', { name: 'Character' }));

        expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
        scrollTo.mockRestore();
    });

    it('does not scroll to top on query-only changes', () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        renderScrollHarness();

        fireEvent.click(screen.getByRole('link', { name: 'Page 2' }));

        expect(scrollTo).not.toHaveBeenCalled();
        scrollTo.mockRestore();
    });
});
