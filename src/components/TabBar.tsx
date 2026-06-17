import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"

interface TabBarProps {
    tabs: string[];
    selectedTab: string;
    onSelectTab: (tab: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab, onSelectTab }) => {

    const [currentTab, setCurrentTab] = useState(selectedTab);
    const currentRoute = useLocation();

    useEffect(() => {
        const path = currentRoute.pathname.split("/")[1]
        const tabname = path.length > 0 ? path.charAt(0).toUpperCase() + path.slice(1) : selectedTab
        setCurrentTab(tabname)
    }, [currentRoute, selectedTab])

    return (
        <div className="relative z-10 -mt-8 px-4 sm:-mt-10">
            <div className="mx-auto max-w-4xl">
                <div className="sm:hidden rounded-2xl border border-white/20 bg-white/90 p-2 shadow-xl shadow-black/20 backdrop-blur dark:border-gray-600/50 dark:bg-gray-800/90">
                    <label htmlFor="Tab" className="sr-only">
                        Tab
                    </label>
                    <select
                        id="Tab"
                        className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-lime-400 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                        value={currentTab}
                        onChange={(e) => onSelectTab(e.target.value)}
                    >
                        {tabs.map((tab) => (
                            <option key={tab} value={tab}>
                                {tab}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="hidden sm:block">
                    <nav className="flex justify-center rounded-full border border-white/20 bg-gray-950/80 p-2 shadow-2xl shadow-black/30 backdrop-blur dark:border-lime-300/20 dark:bg-gray-900/90" aria-label="Main sections">
                        {tabs.map((tab) => {
                            const isSelected = tab === selectedTab

                            return (
                                <Link key={tab} to={`/${tab.toLowerCase()}`}
                                    className={`relative mx-1 rounded-full px-6 py-3 text-sm font-bold tracking-wide transition duration-200 ${isSelected
                                            ? "bg-lime-300 text-gray-950 shadow-lg shadow-lime-300/30"
                                            : "text-gray-300 hover:bg-white/10 hover:text-white dark:text-gray-300 dark:hover:text-white"

                                        }`}
                                    aria-current={isSelected ? "page" : undefined}
                                >
                                    {tab}
                                </Link>
                            )
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TabBar;
