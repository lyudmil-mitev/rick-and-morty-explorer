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
                <div className="border-b border-gray-300 dark:border-gray-600">
                    <nav className="-mb-px flex gap-6">
                        {tabs.map((tab) => (
                            <Link key={tab} to={`/${tab.toLowerCase()}`}
                                className={`shrink-0 border border-transparent p-3 text-sm font-medium ${tab === selectedTab
                                        ? "rounded-t-lg border-gray-500 border-b-white text-sky-600 dark:border-gray-400 dark:border-b-gray-800 bg-gray-200 dark:bg-gray-700"
                                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"

                                    }`}
                            >
                                {tab}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TabBar;