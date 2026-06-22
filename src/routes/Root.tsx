import TabBar from '../components/TabBar'
import Banner from '../components/Banner'
import { Link, Outlet, useLocation } from 'react-router-dom'
import "./Root.css"

function capitalizeString(str: string) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function formatLocation(location: string) {
    const path = location.split("/")[1]

    if (typeof path === "undefined" || path.length < 2) {
        return "Characters";
    } else {
        return capitalizeString(path);
    }
}

export default function Root() {
    const location = useLocation()

    return (<>
        <div className="relative">
            <Banner />
            <TabBar
                tabs={["Characters", "Locations", "Episodes", "About"]}
                selectedTab={formatLocation(location.pathname)}
            />
        </div>
        <main className='bg-gray-100 dark:bg-gray-700'>
            <Outlet />
        </main>
        <footer className='bg-gray-300 p-4 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-400'>
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p>Rick and Morty Explorer</p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Footer navigation">
              <Link to="/characters">Characters</Link>
              <Link to="/locations">Locations</Link>
              <Link to="/episodes">Episodes</Link>
              <Link to="/about">About</Link>
            </nav>
          </div>
        </footer>
    </>)
}
