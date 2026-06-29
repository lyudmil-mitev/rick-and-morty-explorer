import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    return router;
}

function setScrollPosition({ left = 0, top = 0 }: { left?: number; top?: number }) {
    Object.defineProperty(window, 'scrollX', { configurable: true, value: left });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: top });
}

describe('ScrollToTop', () => {
    it('scrolls to top on pathname changes from push navigation', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        renderScrollHarness();
        setScrollPosition({ top: 640 });

        fireEvent.click(screen.getByRole('link', { name: 'Character' }));

        await waitFor(() => {
            expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
        });
        scrollTo.mockRestore();
    });

    it('restores the saved scroll position on browser back navigation', async () => {
        const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
        const router = renderScrollHarness();
        setScrollPosition({ top: 640 });

        fireEvent.click(screen.getByRole('link', { name: 'Character' }));

        await waitFor(() => {
            expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' });
        });

        scrollTo.mockClear();
        setScrollPosition({ top: 120 });
        await router.navigate(-1);

        await waitFor(() => {
            expect(scrollTo).toHaveBeenCalledWith({ top: 640, left: 0, behavior: 'instant' });
        });
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
