# Rick and Morty Explorer
![Morty logo](public/android-chrome-192x192.png)

Rick and Morty 100 years! Rick and Morty 20 Seasons!

## [Open in GitHub Pages](https://lyudmil-mitev.github.io/rick-and-morty-explorer/)

This is a React application built with React, React Router v7, TailwindCSS, Vite, Vitest, and static data prepared from Kaggle exports. Base records come from `robbroadhead/rick-and-morty-api-dataset`, which is itself sourced from the Rick and Morty API. Detail descriptions, episode synopses, and source links come from `robbroadhead/rick-and-morty-details-fandom-wiki-dataset`.

## Features
- Simple responsive design implemented with TailwindCSS
- Supports Light/Dark mode (auto detected from Operating System Theme)
- Awesome hover animations
- Paginated listings of Characters, Locations and Episodes
- Extensive detail pages for Characters, Locations and Episodes
- Loading indicator integrated in the pagination component
- Custom Error page
- Complementary Lawyer Morty animation on hover

## Project Structure
I have annotated the project structure below
```bash
├── index.html # Main entrypoint for Vite build
├── package.json
├── README.md
├── scripts
│   └── prepare-kaggle-dataset.mjs # Downloads Kaggle datasets and prepares public/data/rick-and-morty
├── src
│   ├── api.ts # Dataset-backed resource helpers and URL/id parsing utilities
│   ├── components
│   │   ├── Banner.tsx # Banner component with title header and awesome space background SVG that's less than 1KB
│   │   ├── CharacterCard.tsx # Character card based on MiniCard
│   │   ├── DetailsLayout.tsx # Base layout page for Character Details, Location Details and Episode Details
│   │   ├── EpisodeCard.tsx # Episode card based on MiniCard
│   │   ├── LoadingSpinner.tsx # Loading spinner component, appears in the pagination component
│   │   ├── LocationCard.tsx # Location card based on MiniCard
│   │   ├── MiniCard.tsx # Base card component for CharacterCard, EpisodeCard and LocationCard
│   │   ├── Pagination.tsx # Pagination component for Characters, Locations and Episodes
│   │   └── TabBar.tsx # Main navigation tab bar
│   ├── index.css # Global CSS file, includes TailwindCSS and custom styles
│   ├── dataset.ts # Loads and parses the base Kaggle CSV dataset, builds in-memory indexes
│   ├── details.ts # Fetches one on-demand details JSON file for a character, location, or episode
│   ├── filterOptions.ts # Shared filter select options derived from the dataset
│   ├── loaders.ts # Route loaders for list/detail pages and related-resource loading
│   ├── main.tsx # Main entrypoint for React, Routes are configured here
│   ├── media.ts # Local media helper functions for cards and detail pages
│   ├── mocks # Mock data for Characters, Locations and Episodes
│   │   ├── characterDetail.mock.tsx
│   │   ├── characters.mock.tsx
│   │   ├── episodeDetail.mock.tsx
│   │   ├── episodes.mock.tsx
│   │   ├── locationDetail.mock.tsx
│   │   └── locations.mock.tsx
│   ├── rickmorty.ts # Local Rick and Morty data types used across the app
│   ├── styles
│   │   └── ui.ts # Shared Tailwind class primitives and conditional class helper
│   ├── routes
│   │   ├── CharacterDetails.tsx # Route for Character Details /characters/:id
│   │   ├── Characters.tsx # Route for Characters /characters and /
│   │   ├── EpisodeDetails.tsx # Route for Episode Details /episodes/:id
│   │   ├── Episodes.tsx # Route for Episodes /episodes
│   │   ├── ErrorPage.tsx # Route for Error Page. It catches all exceptions
│   │   ├── LocationDetails.tsx # Route for Location Details /locations/:id
│   │   ├── Locations.tsx # Route for Locations /locations
│   │   ├── Root.css # Global CSS for the root component
│   │   └── Root.tsx # Root component for the application, the other components are nested as Root children
└── public
    └── data
        └── rick-and-morty # Generated dataset assets copied from Kaggle for the app build
```

## Data Flow
The Kaggle dataset is prepared locally or in CI with:

```bash
npm run dataset:prepare
```

That command downloads `robbroadhead/rick-and-morty-api-dataset`, which is built from the Rick and Morty API, then copies the CSVs and character images into `public/data/rick-and-morty/` so Vite serves them as static assets. It also downloads `robbroadhead/rick-and-morty-details-fandom-wiki-dataset`, stores the source-material CSVs under `public/data/rick-and-morty/details-source-material/`, and generates per-record JSON files under `public/data/rick-and-morty/details/`.

The running app reads generated static files only; it does not call the live Rick and Morty API or Fandom while users browse the site. List pages load only the base CSV-derived dataset. Detail pages fetch one details JSON file on demand for the current character, location, or episode, so the browser does not need to load every description and synopsis into memory.

`npm run dev` checks for those generated assets before starting Vite. If they are missing, it first tries to download a `.zip` dataset asset from the latest GitHub release, which works anonymously for public releases. You can override that URL with `DATASET_RELEASE_URL`.

If the release download is unavailable, the script falls back to Kaggle. Kaggle downloads require `KAGGLE_USERNAME` and `KAGGLE_KEY` or `KAGGLE_API_TOKEN` to be set in your environment or in a local `.env` file.

## Styling

Most component layout is still written with Tailwind utility classes. Repeated visual primitives live in `src/styles/ui.ts`, including shared panel, button, link, input, badge, card, and eyebrow styles, plus the small `cx()` helper for conditional class composition.

When changing the UI, prefer using those shared primitives for repeated styling and keep one-off layout classes close to the component markup. Global CSS is reserved for font loading, root page styling, and custom animations such as page transitions, logo motion, and portal hover effects.

## Setup

To clone the application run:

```bash
git clone https://github.com/lyudmil-mitev/rick-and-morty-explorer.git
cd rick-and-morty-explorer
```

To run the development server, use:

```bash
npm install
npm run dev
```

Then, to run the tests, use:
```bash
npm run test
npx vitest --coverage # Measure test coverage
```

To generate local screenshots for visual review, use:
```bash
npm run test:screenshots
```

This prepares the dataset if needed, builds the app, starts a local preview server, and writes screenshots to `screenshots/`.

To refresh the local dataset assets, use:
```bash
npm run dataset:prepare
```

To create a local build run:
```bash
npm run build
```

## Credits
- Rick and Morty is a copyright and trademark of The Cartoon Network, Inc, Adult Swim, Justin Roiland, Dan Harmon and others. 
- This is a fan project for educational purpose and is in no way affiliated to them.
- The data and images are used without claim of ownership and belong to their respective owners.
- The title font is made and [generously provided by John Izaak](https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728)
- The deep space background SVG image is adapted from [work by Bence Szabo](https://codepen.io/finnhvman/pen/bGOYpbO)
- The light-mode alien landscape SVG image is adapted from [work by Bence Szabo](https://codepen.io/finnhvman/pen/bGopgee)
- This project includes posters for seasons from [TVMaze](https://www.tvmaze.com/)
- This project uses the [Rick and Morty API](https://rickandmortyapi.com/) through the Kaggle dataset [`robbroadhead/rick-and-morty-api-dataset`](https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-api-dataset)
- Detail text and source links come from [`robbroadhead/rick-and-morty-details-fandom-wiki-dataset`](https://www.kaggle.com/datasets/robbroadhead/rick-and-morty-details-fandom-wiki-dataset), gathered from the [Rick and Morty Wiki](https://rickandmorty.fandom.com/). Fandom wiki text is licensed under [CC BY-SA](https://www.fandom.com/licensing).

![Mr Poopybutthole logo](public/mr_pbh.webp)
