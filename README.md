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
- Custom Error page

To clone the application run:

```
https://github.com/lyudmil-mitev/rick-and-morty-explorer.git
```

To run the development server, use:

```
npm install
npm run dev
```

Then, to run the tests, use:
```
npm run test
npx vitest --coverage # Measure test coverage
```

To create a local build run:
```
npm run build
cd dist && ln -s . rick-and-morty-explorer # Symlink rick-and-morty-explorer, because that's configured as a base dir in vite.config.ts due to github pages structure
```


## Credits
- Rick and Morty is a copyright and trademark of The Cartoon Network, Inc, Adult Swim, Justin Roiland, Dan Harmon and others. 
- This is a fan project for educational purpose and is in no way affiliated to them.
- The data and images are used without claim of ownership and belong to their respective owners.
- The title font is made and [generously provided by John Izaak](https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728)
- The deep space background svg image is adapted from [work by Bence Szabo](https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728)
- This project includes posters for seasons from tvmaze.com
- This project uses the [Rick and Morty API](https://rickandmortyapi.com/)