import React from "react"
import { Link } from "react-router-dom"

interface TabBarProps {
    tabs: string[];
    selectedTab: string;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab }) => {
    return (
        <div className="absolute left-1/2 bottom-0 z-20 w-full max-w-[calc(100vw-1.5rem)] -translate-x-1/2 translate-y-1/2 px-3 sm:w-fit sm:max-w-none sm:px-4">
            <div className="mx-auto w-fit max-w-full">
                <nav className="inline-flex max-w-full rounded-lg border border-white/20 bg-gray-950/85 p-1.5 shadow-2xl shadow-black/40 backdrop-blur sm:p-2" aria-label="Main sections">
                    {tabs.map((tab) => {
                        const isSelected = tab === selectedTab
                        return (
                            <Link
                                key={tab}
                                to={`/${tab.toLowerCase()}`}
                                className={`${isSelected ? "" : "portal-hover"} relative mx-0.5 rounded-lg px-2.5 py-2 text-[11px] font-bold tracking-wide transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 max-[360px]:px-2 max-[360px]:text-[10px] sm:mx-1 sm:px-6 sm:py-3 sm:text-sm ${isSelected
                                    ? "bg-lime-300 !text-gray-950 shadow-lg shadow-lime-300/30"
                                    : "!text-white hover:!text-white hover:[text-shadow:0_0_8px_rgba(255,255,255,0.9)]"
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
    );
};

export default TabBar;
