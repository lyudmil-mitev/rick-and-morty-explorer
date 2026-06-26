import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import MrPBH from '/mr_pbh.webp'
import { cx, ui } from '../styles/ui';

export default function ErrorPage() {
    const error = useRouteError();
    const message = isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "Looks like something went wrong!";

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-start px-4 py-10 text-center">
          <div className={cx("w-full max-w-md p-6 shadow-xl", ui.panel)}>
            <p className={ui.eyebrow}>Signal interrupted</p>
            <h1 className="mt-3 text-5xl font-extrabold text-slate-950 dark:text-white sm:text-6xl">Oooh weee!</h1>
            <h2 className="mt-3 text-lg font-semibold text-slate-600 dark:text-slate-300">{message}</h2>
            <img src={MrPBH} alt="Mr. Poopybutthole" className="mx-auto mt-5 h-auto w-24" />

            <Link to="/" className={cx("mt-6 shadow-lg shadow-lime-300/20 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900", ui.primaryLinkButton)}>Go Back</Link>
          </div>
        </div>
    );
}
