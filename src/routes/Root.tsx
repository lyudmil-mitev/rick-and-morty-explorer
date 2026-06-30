import TabBar from '../components/TabBar'
import Banner from '../components/Banner'
import ScrollToTop from '../components/ScrollToTop'
import { Link, Outlet, useLocation, useMatches } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import "./Root.css"
import { cx } from '../styles/ui'

type Theme = "light" | "dark";
type RouteHandle = {
    splash?: boolean;
}

const tabs = [
    { label: "Home", to: "/" },
    { label: "Characters", to: "/characters" },
    { label: "Locations", to: "/locations" },
    { label: "Episodes", to: "/episodes" },
    { label: "About", to: "/about" },
];

function getPreferredTheme(): Theme {
    if (typeof window === "undefined") {
        return "dark";
    }

    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
        return storedTheme;
    }

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function capitalizeString(str: string) {
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

function formatLocation(location: string) {
    const path = location.split("/")[1]

    if (typeof path === "undefined" || path.length < 2) {
        return "Home";
    } else {
        return capitalizeString(path);
    }
}

function ThemeToggle({
    theme,
    onToggle,
    className,
}: {
    theme: Theme;
    onToggle: () => void;
    className?: string;
}) {
    const nextTheme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            className={cx(
                "inline-flex h-10 items-center gap-2 rounded-full border border-cyan-700/25 bg-[#fbfaf2]/85 px-2.5 pr-3 text-xs font-bold text-slate-800 shadow-lg shadow-cyan-950/10 backdrop-blur transition hover:border-lime-500/70 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef2ed] dark:border-cyan-500/30 dark:bg-slate-950/85 dark:text-slate-100 dark:shadow-black/25 dark:hover:border-lime-300/70 dark:hover:text-lime-200 dark:focus-visible:ring-lime-300 dark:focus-visible:ring-offset-slate-950",
                className,
            )}
            onClick={onToggle}
            aria-label={`Switch to ${nextTheme} theme`}
            aria-pressed={theme === "dark"}
        >
            <span className="relative h-6 w-11 rounded-full border border-cyan-700/30 bg-cyan-50 shadow-inner dark:border-cyan-500/35 dark:bg-slate-900">
                <span className={cx(
                    "absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.8)] transition-[left]",
                    theme === "dark" ? "left-[1.45rem]" : "left-1",
                )} />
            </span>
            <span>{theme === "dark" ? "Dark" : "Light"}</span>
        </button>
    );
}

export default function Root() {
    const location = useLocation()
    const matches = useMatches()
    const [theme, setTheme] = useState<Theme>(getPreferredTheme);
    const isSplashRoute = matches.some((match) => (match.handle as RouteHandle | undefined)?.splash);

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.classList.toggle("light", theme === "light");
        root.style.colorScheme = theme === "light" ? "only light" : "dark";
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    return (<>
        <ScrollToTop />
        {isSplashRoute ? (
            <ThemeToggle
                theme={theme}
                onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="absolute right-4 top-4 z-40 sm:right-5 sm:top-5"
            />
        ) : (
            <div className="relative">
                <Banner theme={theme} />
                <ThemeToggle
                    theme={theme}
                    onToggle={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="absolute right-4 top-4 z-30 sm:right-5 sm:top-5"
                />
                <TabBar
                    tabs={tabs}
                    selectedTab={formatLocation(location.pathname)}
                />
            </div>
        )}
        <main className={cx('bg-[#eef2ed] text-slate-900 dark:bg-[#111827] dark:text-slate-100', isSplashRoute && 'home-main')}>
            <Outlet context={{ theme }} />
        </main>
        <footer className='border-t border-cyan-700/15 bg-[#fbfaf2] p-4 text-sm text-slate-600 shadow-[0_-12px_40px_rgba(8,186,227,0.08)] dark:border-cyan-300/20 dark:bg-slate-950 dark:text-slate-300 dark:shadow-[0_-12px_40px_rgba(82,255,15,0.08)]'>
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-semibold text-cyan-700 dark:text-cyan-200">Rick and Morty Explorer</p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Footer navigation">
              <Link className="transition hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:hover:text-lime-300 dark:focus-visible:ring-lime-300" to="/">Home</Link>
              <Link className="transition hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:hover:text-lime-300 dark:focus-visible:ring-lime-300" to="/characters">Characters</Link>
              <Link className="transition hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:hover:text-lime-300 dark:focus-visible:ring-lime-300" to="/locations">Locations</Link>
              <Link className="transition hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:hover:text-lime-300 dark:focus-visible:ring-lime-300" to="/episodes">Episodes</Link>
              <Link className="transition hover:text-lime-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:hover:text-lime-300 dark:focus-visible:ring-lime-300" to="/about">About</Link>
            </nav>
          </div>
        </footer>
    </>)
}