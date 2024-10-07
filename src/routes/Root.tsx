import TabBar from '../components/TabBar'
import Banner from '../components/Banner'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import "./Root.css"

function capitalizeString(str: string) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function formatLocation(location: string) {
    const path = location.split("/").pop();

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
        <main>
            <Outlet />
        </main>
        <footer>
            2024 - Implemented with Rick and Morty API
        </footer>
    </>)
}