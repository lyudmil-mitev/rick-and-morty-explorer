import { Link, useLocation } from "react-router-dom";
import { cx, ui } from "../styles/ui";

export default function EmptyResults() {
    const location = useLocation();

    return (
        <div className={cx("p-6 text-center", ui.translucentPanel)}>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">No records matched</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Try a broader scan of the multiverse.</p>
            <Link
                to={`${location.pathname}?page=1`}
                className={cx("mt-4 text-sm shadow-sm", ui.primaryLinkButton)}
            >
                Clear filters
            </Link>
        </div>
    );
}
