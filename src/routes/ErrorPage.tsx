import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import MrPBH from '/mr_pbh.webp'

export default function ErrorPage() {
    const error = useRouteError();
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "Looks like something went wrong!";

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-start px-4 py-10 text-center">
          <div className="w-full max-w-md rounded-lg border border-cyan-700/15 bg-[#fbfaf2] p-6 shadow-xl shadow-slate-300/30 dark:border-cyan-300/15 dark:bg-slate-800 dark:shadow-black/20">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Signal interrupted</p>
            <h1 className="mt-3 text-5xl font-extrabold text-slate-950 dark:text-white sm:text-6xl">Oooh weee!</h1>
            <h2 className="mt-3 text-lg font-semibold text-slate-600 dark:text-slate-300">{message}</h2>
            <img src={MrPBH} alt="Mr. Poopybutthole" className="mx-auto mt-5 h-auto w-24" />

            <Link to="/" className="mt-6 inline-flex rounded-md bg-lime-300 px-4 py-2 font-bold text-slate-950 shadow-lg shadow-lime-300/20 transition hover:bg-lime-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">Go Back</Link>
          </div>
        </div>
    );
}
