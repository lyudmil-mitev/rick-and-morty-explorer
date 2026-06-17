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
        <div className="absolute left-1/2 bottom-0 z-20 w-fit -translate-x-1/2 translate-y-1/2 px-4">
            <div className="mx-auto w-fit">
                <div className="sm:hidden rounded-2xl border border-white/20 bg-white/90 p-2 shadow-xl shadow-black/20 backdrop-blur dark:border-gray-600/50 dark:bg-gray-800/90">
                    <label htmlFor="Tab" className="sr-only">Tab</label>
                    <select id="Tab" className="w-full rounded-xl border-0 bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-900 outline-none ring-1 ring-gray-200 transition focus:ring-2 focus:ring-lime-400 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700" value={currentTab} onChange={(e) => onSelectTab(e.target.value)}>
                        {tabs.map((tab) => (<option key={tab} value={tab}>{tab}</option>))}
                    </select>
                </div>

                <div className="hidden sm:block">
                    <nav className="inline-flex rounded-full border border-white/20 bg-gray-950/85 p-2 shadow-2xl shadow-black/40 backdrop-blur" aria-label="Main sections">
                        {tabs.map((tab) => {
                            const isSelected = tab === selectedTab
                            return (
                                <Link
                                    key={tab}
                                    to={`/${tab.toLowerCase()}`}
                                    className={`portal-hover relative mx-1 rounded-full px-6 py-3 text-sm font-bold tracking-wide !text-white transition duration-200 hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.9)] ${isSelected
                                        ? "bg-lime-300 shadow-lg shadow-lime-300/30 [text-shadow:0_0_8px_rgba(255,255,255,0.9)]"
                                        : "text-gray-300"
                                    }`}
                                    aria-current={isSelected ? "page" : undefined}
                                >
                                    <span className="relative z-10">{tab}</span>
                                </Link>
                            )}
                        )}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default TabBar;