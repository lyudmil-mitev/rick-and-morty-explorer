import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';

import About from './About';

describe('About', () => {
    it('renders project information, credits, and the illustration', () => {
        render(<About />);

        expect(screen.getByRole('heading', { level: 1, name: 'Rick and Morty Explorer' })).toBeDefined();
        expect(screen.getByRole('img', { name: 'Mr. Poopybutthole' })).toBeDefined();
        expect(screen.getByRole('link', { name: "Kaggle's Rick and Morty API dataset" }).getAttribute('href')).toBe('https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-api-dataset');
        expect(screen.getByRole('link', { name: "Kaggle's Rick and Morty details Fandom Wiki dataset" }).getAttribute('href')).toBe('https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-details-fandom-wiki-dataset');
        expect(screen.getByRole('link', { name: 'CC BY-SA' }).getAttribute('href')).toBe('https://www.fandom.com/licensing');
        expect(screen.getByRole('link', { name: 'Rick and Morty API' }).getAttribute('href')).toBe('https://rickandmortyapi.com/');
        expect(screen.getByRole('link', { name: 'GitHub' }).getAttribute('href')).toBe('https://github.com/lyudmil-mitev/rick-and-morty-explorer');
        expect(screen.getByText(/This is a fan website/)).toBeDefined();
    });
});
