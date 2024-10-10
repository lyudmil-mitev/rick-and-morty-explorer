import TabBar from '../components/TabBar'
import Banner from '../components/Banner'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
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
    const navigate = useNavigate()
    const location = useLocation()
    function handleSelectTab(tab: string) {
        navigate(`${tab.toLowerCase()}/`)
    }

    return (<>
        <Banner />
        <TabBar
            tabs={["Characters", "Locations", "Episodes"]}
            selectedTab={formatLocation(location.pathname)}
            onSelectTab={handleSelectTab}
        />
        <main className='bg-gray-100 dark:bg-gray-700'>
            <Outlet />
        </main>
        <footer className='bg-gray-300 dark:bg-gray-800 p-4 text-xs text-gray-700 dark:text-gray-400'>
          <div className="flex flex-wrap justify-center">
            <div className="flex flex-col space-y-2 mx-4">
                <p>Thank you for visiting Rick and Morty Explorer</p>
                <p>This project was created by <a href="https://www.linkedin.com/in/lyudmil-mitev-97556318/" target="_blank">Lyudmil Mitev</a></p>
                <p>using Vite, React, TypeScript and React Router.</p>
                <p>Check out the source code on <a href="https://github.com/lyudmil-mitev/rick-and-morty-explorer" target="_blank">GitHub</a></p>
                <p>And feel free to comment or contribute!</p>
            </div>
            <div className="flex flex-col space-y-2 mx-4">
              <p>Implemented with <a href="https://rickandmortyapi.com/" target="_blank">Rick and Morty API</a></p>
              <p>Rick and Morty is a copyright and trademark</p>
              <p>of The Cartoon Network, Inc, Adult Swim,</p>
              <p>Justin Roiland, Dan Harmon and others.</p>
              <p>This is a fan website and is in no way affiliated to them.</p>
            </div>
            <div className="flex flex-col space-y-2 mx-4">
              <p>The data and images are used without claim </p>
              <p>of ownership and belong to their respective owners.</p>
              <p>The title font is made and <a href="https://www.deviantart.com/jonizaak/art/Get-Schwifty-A-Rick-and-Morty-font-638073728" target='_blank'>generously provided by John Izaak</a></p>
              <p>The deep space background svg image</p>
              <p>is adapted from <a href="https://codepen.io/finnhvman/pen/bGOYpbO" target="_blank">work by Bence Szabo</a></p>
            </div>
          </div>
        </footer>
    </>)
}