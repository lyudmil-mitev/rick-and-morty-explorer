# Rick and Morty API explorer
![Morty logo](public/android-chrome-192x192.png)

Rick and Morty 100 years! Rick and Morty 20 Seasons!

## [Open in GitHub Pages](https://lyudmil-mitev.github.io/rick-and-morty-explorer/)

This is a React application built with React, React Router v6, TailwindCSS, Vite, Vitest and the Rick and Morty API

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
├── src
│   ├── components
│   │   ├── Banner.tsx # Banner component with title header and awesome space background SVG that's less than 1KB
│   │   ├── CharacterCard.tsx # Character card based on MiniCard
│   │   ├── DetailsLayout.tsx # Base layout page for Character Details, Location Details and Episode Details
│   │   ├── EpisodeCard.tsx # Episode card based on MiniCard
│   │   ├── LoadingSpinner.tsx # Loading spinner component, appears in the pagination component
│   │   ├── LocationCard.tsx # Location card based on MiniCard
│   │   ├── MiniCard.tsx # Base card component for CharacterCard, EpisodeCard and LocationCard
│   │   ├── Pagination.tsx # Pagination component for Characters, Locations and Episodes
│   │   └── TabBar.tsx # Man navigation tab bar
│   ├── index.css # Global CSS file, includes TailwindCSS and custom styles
│   ├── loaders.ts # Custom loaders for Characters, Locations and Episodes and some API helpers
│   ├── main.tsx # Main entrypoint for React, Routes are configured here
│   ├── mocks # Mock data for Characters, Locations and Episodes, copied from the Rick and Morty API JS Client Object
│   │   ├── characterDetail.mock.tsx
│   │   ├── characters.mock.tsx
│   │   ├── episodeDetail.mock.tsx
│   │   ├── episodes.mock.tsx
│   │   ├── locationDetail.mock.tsx
│   │   └── locations.mock.tsx
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
```

## Setup

To clone the application run:

```
https://github.com/lyudmil-mitev/rick-and-morty-explorer.git
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

To create a local build run:
```bash
npm run build
cd dist && ln -s . rick-and-morty-explorer # Symlink rick-and-morty-explorer, because that's configured as a base dir in vite.config.ts due to github pages structure
```

## Credits
- Rick and Morty is a copyright and trademark of The Cartoon Network, Inc, Adult Swim, Justin Roiland, Dan Harmon and others. 
- This is a fan project for educational purpose and is in no way affiliated to them.
- The data and images are used without claim of ownership and belong to their respective owners.
- The title font is made and [generously provided by John Izaak](https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728)
- The deep space background svg image is adapted from [work by Bence Szabo](https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728)
- This project includes posters for seasons from [TVMaze](https://www.tvmaze.com/)
- This project uses the [Rick and Morty API](https://rickandmortyapi.com/)

![Mr Poopybutthole logo](public/mr_pbh.webp)