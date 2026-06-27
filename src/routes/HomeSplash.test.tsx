import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router-dom';
import HomeSplash from './HomeSplash';

function renderHomeSplash() {
    return render(
        <MemoryRouter>
            <HomeSplash />
        </MemoryRouter>,
    );
}

function renderHomeSplashRouter(initialEntry = '/') {
    const router = createMemoryRouter([
        {
            path: '/',
            element: <HomeSplash />,
        },
    ], { initialEntries: [initialEntry] });

    render(<RouterProvider router={router} />);
    return router;
}

describe('HomeSplash', () => {
    it('renders the splash title and destination links without the old intro copy', () => {
        renderHomeSplash();

        expect(screen.getByRole('heading', { level: 1, name: 'Rick and Morty Explorer' })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Replay title animation' })).toBeDefined();
        expect(screen.queryByText('Multiverse entry file')).toBeNull();
        expect(screen.queryByText('Choose a portal')).toBeNull();
        expect(screen.getByRole('img', { name: 'Characters preview images' })).toBeDefined();

        expect(screen.getByRole('link', { name: /Characters: Variants/ }).getAttribute('href')).toBe('/characters');
        expect(screen.getByRole('link', { name: /Locations: Planets/ }).getAttribute('href')).toBe('/locations');
        expect(screen.getByRole('link', { name: /Episodes: Season-by-season/ }).getAttribute('href')).toBe('/episodes');
    });

    it('replays the title animation when the title control is clicked', () => {
        renderHomeSplash();

        const titleReplay = screen.getByRole('button', { name: 'Replay title animation' });

        expect(titleReplay.getAttribute('data-title-zap-version')).toBe('0');

        fireEvent.click(titleReplay);
        expect(titleReplay.getAttribute('data-title-zap-version')).toBe('1');

        fireEvent.click(titleReplay);
        expect(titleReplay.getAttribute('data-title-zap-version')).toBe('2');
    });

    it('keeps initial focus out of the carousel while supporting document-level keyboard navigation', async () => {
        renderHomeSplash();

        const carousel = screen.getByRole('region', { name: 'Portal destinations' });

        expect(document.activeElement).not.toBe(carousel);

        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');
    });

    it('rotates the carousel endlessly with controls and keyboard arrows', () => {
        renderHomeSplash();

        const carousel = screen.getByRole('region', { name: 'Portal destinations' });
        const next = screen.getByRole('button', { name: 'Show next portal' });
        const previous = screen.getByRole('button', { name: 'Show previous portal' });

        expect(screen.getByRole('status').textContent).toContain('Active portal: Characters');
        expect(next.textContent).toBe('›');
        expect(previous.textContent).toBe('‹');

        fireEvent.click(next);
        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');

        fireEvent.keyDown(carousel, { key: 'ArrowRight' });
        expect(screen.getByRole('status').textContent).toContain('Active portal: Episodes');

        fireEvent.keyDown(carousel, { key: 'ArrowRight' });
        expect(screen.getByRole('status').textContent).toContain('Active portal: Characters');

        fireEvent.click(previous);
        expect(screen.getByRole('status').textContent).toContain('Active portal: Episodes');
    });

    it('rotates the carousel with swipe gestures', () => {
        renderHomeSplash();

        const carousel = screen.getByRole('region', { name: 'Portal destinations' });

        fireEvent.pointerDown(carousel, { pointerId: 1, clientX: 260 });
        fireEvent.pointerUp(carousel, { pointerId: 1, clientX: 120 });

        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');

        fireEvent.pointerDown(carousel, { pointerId: 2, clientX: 120 });
        fireEvent.pointerUp(carousel, { pointerId: 2, clientX: 260 });

        expect(screen.getByRole('status').textContent).toContain('Active portal: Characters');
    });

    it('marks the centered card as active', () => {
        renderHomeSplash();

        const carousel = screen.getByRole('region', { name: 'Portal destinations' });
        const characterCard = within(carousel).getByRole('link', { name: /Characters: Variants/ });
        const locationCard = within(carousel).getByRole('link', { name: /Locations: Planets/ });

        expect(characterCard.getAttribute('data-active')).toBe('true');
        expect(locationCard.getAttribute('data-active')).toBe('false');

        fireEvent.click(screen.getByRole('button', { name: 'Show next portal' }));

        expect(characterCard.getAttribute('data-active')).toBe('false');
        expect(locationCard.getAttribute('data-active')).toBe('true');
    });

    it('navigates when the active card is clicked', async () => {
        const router = renderHomeSplashRouter('/');

        fireEvent.click(screen.getByRole('link', { name: /Characters: Variants/ }));

        await waitFor(() => {
            expect(router.state.location.pathname).toBe('/characters');
        });
    });

    it('selects a background card before navigating on a second click', async () => {
        const router = renderHomeSplashRouter('/');
        const locationCard = screen.getByRole('link', { name: /Locations: Planets/ });

        fireEvent.click(locationCard);

        expect(router.state.location.pathname).toBe('/');
        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');

        fireEvent.click(locationCard);

        await waitFor(() => {
            expect(router.state.location.pathname).toBe('/locations');
        });
    });

    it('navigates to the active card when Enter is pressed on the carousel', async () => {
        const router = renderHomeSplashRouter('/');
        const carousel = screen.getByRole('region', { name: 'Portal destinations' });

        fireEvent.keyDown(carousel, { key: 'ArrowRight' });
        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');

        fireEvent.keyDown(carousel, { key: 'Enter' });

        await waitFor(() => {
            expect(router.state.location.pathname).toBe('/locations');
        });
    });

    it('navigates to the active card when Enter is pressed outside interactive controls', async () => {
        const router = renderHomeSplashRouter('/');

        fireEvent.keyDown(document, { key: 'ArrowRight' });
        expect(screen.getByRole('status').textContent).toContain('Active portal: Locations');

        fireEvent.keyDown(document, { key: 'Enter' });

        await waitFor(() => {
            expect(router.state.location.pathname).toBe('/locations');
        });
    });

    it('does not hijack Enter from focused child controls', async () => {
        const router = renderHomeSplashRouter('/');
        const next = screen.getByRole('button', { name: 'Show next portal' });

        fireEvent.keyDown(next, { key: 'Enter' });
        expect(router.state.location.pathname).toBe('/');
        expect(screen.getByRole('status').textContent).toContain('Active portal: Characters');
    });
});
