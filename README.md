# Rick and Morty Explorer
![Morty logo](public/android-chrome-192x192.png)

Rick and Morty 100 years! Rick and Morty 20 Seasons!

## [Open in GitHub Pages](https://lyudmil-mitev.github.io/rick-and-morty-explorer/)

This is a React application built with React, React Router v7, TailwindCSS, Vite, Vitest, and static data prepared from the Kaggle `robbroadhead/rick-and-morty-api-dataset` export. That Kaggle dataset is itself sourced from the Rick and Morty API.

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
│   └── prepare-kaggle-dataset.mjs # Downloads the Kaggle dataset and copies it into public/data/rick-and-morty
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
│   ├── dataset.ts # Loads and parses the Kaggle CSV dataset, builds in-memory indexes
│   ├── loaders.ts # Route loaders for list/detail pages and related-resource loading
│   ├── main.tsx # Main entrypoint for React, Routes are configured here
│   ├── mocks # Mock data for Characters, Locations and Episodes
│   │   ├── characterDetail.mock.tsx
│   │   ├── characters.mock.tsx
│   │   ├── episodeDetail.mock.tsx
│   │   ├── episodes.mock.tsx
│   │   ├── locationDetail.mock.tsx
│   │   └── locations.mock.tsx
│   ├── rickmorty.ts # Local Rick and Morty data types used across the app
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

That command downloads `robbroadhead/rick-and-morty-api-dataset`, which is built from the Rick and Morty API, then copies the CSVs and character images into `public/data/rick-and-morty/` so Vite serves them as static assets. The running app reads those generated static files; it does not call the live Rick and Morty API while users browse the site.

`npm run dev` checks for those generated assets before starting Vite. If they are missing, it first tries to download a `.zip` dataset asset from the latest GitHub release, which works anonymously for public releases. You can override that URL with `DATASET_RELEASE_URL`.

If the release download is unavailable, the script falls back to Kaggle. Kaggle downloads require `KAGGLE_USERNAME` and `KAGGLE_KEY` or `KAGGLE_API_TOKEN` to be set in your environment or in a local `.env` file.

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

![Mr Poopybutthole logo](public/mr_pbh.webp)
