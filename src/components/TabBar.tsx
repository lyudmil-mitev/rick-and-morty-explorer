import React from "react"
import { Link } from "react-router-dom"
import { cx } from "../styles/ui";

export type TabItem = {
    label: string;
    to: string;
}

interface TabBarProps {
    tabs: TabItem[];
    selectedTab: string;
    variant?: "banner" | "floating";
}

const TabBar: React.FC<TabBarProps> = ({ tabs, selectedTab, variant = "banner" }) => {
    return (
        <div className={cx(
            variant === "banner"
                ? "absolute bottom-0 left-1/2 z-20 w-full max-w-[calc(100vw-1.5rem)] -translate-x-1/2 translate-y-1/2 px-3 sm:w-fit sm:max-w-none sm:px-4"
                : "w-full max-w-[calc(100vw-1.5rem)] sm:w-fit sm:max-w-none",
        )}>
            <div className="mx-auto w-fit max-w-full">
                <nav className="inline-flex max-w-full rounded-lg border border-cyan-700/20 bg-[#fbfaf2]/88 p-1.5 shadow-2xl shadow-cyan-950/10 backdrop-blur dark:border-cyan-500/30 dark:bg-slate-950/90 dark:shadow-lime-300/10 sm:p-2" aria-label="Main sections">
                    {tabs.map((tab) => {
                        const isSelected = tab.label === selectedTab
                        return (
                            <Link
                                key={tab.to}
                                to={tab.to}
                                className={cx(
                                    !isSelected && "portal-hover",
                                    "relative mx-0.5 overflow-hidden rounded-md px-2.5 py-2 text-[11px] font-bold tracking-wide transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef2ed] dark:focus-visible:ring-lime-300 dark:focus-visible:ring-offset-slate-950 max-[360px]:px-2 max-[360px]:text-[10px] sm:mx-1 sm:px-6 sm:py-3 sm:text-sm",
                                    isSelected
                                        ? "bg-lime-300 !text-slate-950 shadow-lg shadow-lime-300/25 ring-1 ring-cyan-700/20 dark:shadow-lime-300/30 dark:ring-cyan-500/40"
                                        : "!text-slate-700 hover:!text-slate-950 hover:bg-cyan-200/40 hover:[text-shadow:0_0_8px_rgba(183,255,68,0.65)] dark:!text-slate-100 dark:hover:!text-white dark:hover:bg-cyan-300/10 dark:hover:[text-shadow:0_0_8px_rgba(183,255,68,0.85)]",
                                )}
                                aria-current={isSelected ? "page" : undefined}
                            >
                                <span className="relative z-10">{tab.label}</span>
                            </Link>
                        )}
                    )}
                </nav>
            </div>
        </div>
    );
};

export default TabBar;
