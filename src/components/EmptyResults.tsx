import { Link, useLocation } from "react-router-dom";

export default function EmptyResults() {
    const location = useLocation();

    return (
        <div className="rounded-lg border border-cyan-700/15 bg-[#fbfaf2]/85 p-6 text-center shadow-md shadow-slate-300/30 dark:border-cyan-300/15 dark:bg-slate-800/80 dark:shadow-black/20">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">No records matched</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Try a broader scan of the multiverse.</p>
            <Link
                to={`${location.pathname}?page=1`}
                className="mt-4 inline-flex rounded-md bg-lime-300 px-4 py-2 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400"
            >
                Clear filters
            </Link>
        </div>
    );
}
