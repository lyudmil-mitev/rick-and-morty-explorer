import TabBar from '../components/TabBar'
import Banner from '../components/Banner'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useLayoutEffect, useState } from 'react'
import "./Root.css"

type Theme = "light" | "dark";

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
        return "Characters";
    } else {
        return capitalizeString(path);
    }
}

export default function Root() {
    const location = useLocation()
    const [theme, setTheme] = useState<Theme>(getPreferredTheme);

    useLayoutEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.classList.toggle("light", theme === "light");
        root.style.colorScheme = theme;
        window.localStorage.setItem("theme", theme);
    }, [theme]);

    const nextTheme = theme === "dark" ? "light" : "dark";

    return (<>
        <div className="relative">
            <Banner />
            <button
                type="button"
                className="absolute right-3 top-3 z-30 inline-flex h-10 items-center gap-2 rounded-full border border-cyan-300/25 bg-slate-950/85 px-2.5 pr-3 text-xs font-bold text-slate-100 shadow-lg shadow-black/25 backdrop-blur transition hover:border-lime-300/70 hover:text-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:right-4 sm:top-4"
                onClick={() => setTheme(nextTheme)}
                aria-label={`Switch to ${nextTheme} theme`}
                aria-pressed={theme === "dark"}
            >
                <span className="relative h-6 w-11 rounded-full border border-cyan-300/35 bg-slate-900 shadow-inner">
                    <span className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-lime-300 shadow-[0_0_10px_rgba(190,242,100,0.8)] transition-[left] ${theme === "dark" ? "left-[1.45rem]" : "left-1"}`} />
                </span>
                <span>{theme === "dark" ? "Dark" : "Light"}</span>
            </button>
            <TabBar
                tabs={["Characters", "Locations", "Episodes", "About"]}
                selectedTab={formatLocation(location.pathname)}
            />
        </div>
        <main className='bg-[#eef2ed] text-slate-900 dark:bg-[#111827] dark:text-slate-100'>
            <Outlet />
        </main>
        <footer className='border-t border-cyan-300/20 bg-slate-950 p-4 text-sm text-slate-300 shadow-[0_-12px_40px_rgba(82,255,15,0.08)]'>
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-semibold text-cyan-200">Rick and Morty Explorer</p>
            <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2" aria-label="Footer navigation">
              <Link className="transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300" to="/characters">Characters</Link>
              <Link className="transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300" to="/locations">Locations</Link>
              <Link className="transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300" to="/episodes">Episodes</Link>
              <Link className="transition hover:text-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300" to="/about">About</Link>
            </nav>
          </div>
        </footer>
    </>)
}
