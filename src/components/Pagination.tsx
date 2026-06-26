import { FormEvent, useId } from "react";
import { Link, useNavigate, useNavigation, useSearchParams } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";
import { cx } from "../styles/ui";

function parsePageValue(pageValue: FormDataEntryValue | string | number | null) {
    const page = Number.parseInt(String(pageValue), 10);
    return Number.isFinite(page) ? page : null;
}

function clampPage(page: number, totalPages: number) {
    return Math.min(Math.max(page, 1), totalPages);
}

export default function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
    const { state } = useNavigation();
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const pageInputId = useId();

    if (!Number.isFinite(page) || !Number.isFinite(totalPages) || page < 1 || page > totalPages) {
        throw new Error("Page not found");
    }

    function getPageUrl(nextPage: number) {
        const nextParams = new URLSearchParams(params);
        nextParams.set("page", String(nextPage));
        return `?${nextParams.toString()}`;
    }

    function navigateToPage(pageValue: FormDataEntryValue | string | number | null, form: HTMLFormElement) {
        const requestedPage = parsePageValue(pageValue);
        if (requestedPage === null) {
            form?.reset();
            return;
        }

        const nextPage = clampPage(requestedPage, totalPages);
        const pageInput = form.elements.namedItem("page");
        if (pageInput instanceof HTMLInputElement) {
            pageInput.value = String(nextPage);
        }
        const nextParams = new URLSearchParams(params);
        nextParams.set("page", String(nextPage));
        navigate(`?${nextParams.toString()}`);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        navigateToPage(formData.get("page"), form);
    }

    const pageButtonClass = "flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold leading-none text-slate-600 transition hover:bg-lime-200 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:text-slate-200 dark:hover:bg-lime-300 dark:hover:text-slate-950";
    const disabledPageButtonClass = "pointer-events-none opacity-40";

    return (
        <nav className="flex justify-center px-4 py-5" aria-label="Pagination">
            <div className="flex w-full max-w-md items-center justify-center gap-4 rounded-full border border-cyan-700/20 bg-white/70 px-4 py-2 shadow-sm backdrop-blur dark:border-cyan-300/15 dark:bg-slate-950/45 dark:shadow-lime-950/20">
                <Link
                    to={getPageUrl(page - 1)}
                    className={cx(pageButtonClass, page === 1 && disabledPageButtonClass)}
                    aria-label="Previous page"
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : undefined}
                >
                    ‹
                </Link>

                <form className="flex min-w-0 items-center justify-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300" onSubmit={handleSubmit}>
                    <label htmlFor={pageInputId} className="shrink-0">Page</label>
                    <input
                        key={page}
                        id={pageInputId}
                        name="page"
                        className="h-9 w-14 rounded-md border border-transparent bg-transparent text-center font-bold text-slate-950 outline-none transition hover:border-cyan-600/30 hover:bg-white/90 focus:border-lime-500 focus:bg-white focus:ring-2 focus:ring-lime-300 dark:text-slate-100 dark:hover:border-cyan-300/30 dark:hover:bg-slate-800/70 dark:focus:bg-slate-900"
                        inputMode="numeric"
                        min={1}
                        max={totalPages}
                        type="number"
                        defaultValue={page}
                        onBlur={(event) => {
                            if (event.currentTarget.value.trim().length === 0) {
                                event.currentTarget.value = String(page);
                            }
                        }}
                    />
                    <span className="flex shrink-0 items-center gap-2">
                        of {totalPages}
                        {state === "loading" ? <LoadingSpinner /> : null}
                    </span>
                </form>

                <Link
                    to={getPageUrl(page + 1)}
                    className={cx(pageButtonClass, page === totalPages && disabledPageButtonClass)}
                    aria-label="Next page"
                    aria-disabled={page === totalPages}
                    tabIndex={page === totalPages ? -1 : undefined}
                >
                    ›
                </Link>
            </div>
        </nav>
    );
}
