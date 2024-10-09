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
        const tabname = path.charAt(0).toUpperCase() + path.slice(1)
        setCurrentTab(tabname)
    }, [currentRoute])

    return (
        <div className="-mt-11">
            <div className="sm:hidden">
                <label htmlFor="Tab" className="sr-only">
                    Tab
                </label>
                <select
                    id="Tab"
                    className="w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
                    <nav className="-mb-px flex gap-6">
                        {tabs.map((tab) => (
                            <Link key={tab} to={`/${tab.toLowerCase()}`}
                                className={`shrink-0  p-3 text-sm font-medium ${tab === selectedTab
                                        ? "rounded-t-lg border-b-white text-sky-600 bg-gray-100 dark:bg-gray-700"
                                        : "text-gray-300 hover:text-gray-100 dark:text-gray-400 dark:hover:text-gray-300"

                                    }`}
                            >
                                {tab}
                            </Link>
                        ))}
                    </nav>
            </div>
        </div>
    );
};

export default TabBar;