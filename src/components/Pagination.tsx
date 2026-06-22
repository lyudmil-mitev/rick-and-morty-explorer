import { FormEvent, KeyboardEvent, PointerEvent, useId, useRef } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

export default function Pagination({ page, totalPages }: { page: number, totalPages: number }) {
    const { state } = useNavigation();
    const navigate = useNavigate();
    const pageInputId = useId();
    const shouldNavigateOnChange = useRef(false);

    if (isNaN(page) || isNaN(totalPages) || page < 1 || page > totalPages) {
        throw new Error('Page not found');
    }

    function navigateToPage(pageValue: FormDataEntryValue | string | number | null, form?: HTMLFormElement) {
        const requestedPage = Number.parseInt(String(pageValue), 10);
        if (!Number.isFinite(requestedPage)) {
            form?.reset();
            return;
        }

        const nextPage = Math.min(Math.max(requestedPage, 1), totalPages);
        if (form) {
            form.page.value = String(nextPage);
        }
        navigate(`?page=${nextPage}`);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);

        navigateToPage(formData.get("page"), form);
    }

    function handleInputPointerDown(event: PointerEvent<HTMLInputElement>) {
        const inputRect = event.currentTarget.getBoundingClientRect();
        shouldNavigateOnChange.current = event.clientX > inputRect.right - 24;
    }

    function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        shouldNavigateOnChange.current = event.key === "ArrowUp" || event.key === "ArrowDown";
    }

    const pageButtonClass = "flex h-9 w-9 items-center justify-center rounded-full text-xl font-bold leading-none text-gray-600 transition hover:bg-lime-100 hover:text-gray-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 dark:text-gray-200 dark:hover:bg-lime-300 dark:hover:text-gray-950";
    const disabledPageButtonClass = "pointer-events-none opacity-40";

    return (
        <nav className="flex justify-center px-4 pb-4 pt-8" aria-label="Pagination">
            <div className="flex w-full max-w-md items-center justify-center gap-4">
                <Link
                    to={`?page=${page - 1}`}
                    className={`${pageButtonClass} ${page === 1 ? disabledPageButtonClass : ""}`}
                    aria-label="Previous page"
                    aria-disabled={page === 1}
                    tabIndex={page === 1 ? -1 : undefined}
                >
                    ‹
                </Link>

                <form className="flex min-w-0 items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300" onSubmit={handleSubmit}>
                    <label htmlFor={pageInputId} className="shrink-0">Page</label>
                    <input
                        key={page}
                        id={pageInputId}
                        name="page"
                        className="h-9 w-14 rounded-md border border-transparent bg-transparent text-center font-bold text-gray-900 outline-none transition hover:border-gray-300 hover:bg-white/70 focus:border-lime-400 focus:bg-white focus:ring-2 focus:ring-lime-300 dark:text-gray-100 dark:hover:border-gray-600 dark:hover:bg-gray-800/70 dark:focus:bg-gray-900"
                        inputMode="numeric"
                        min={1}
                        max={totalPages}
                        type="number"
                        defaultValue={page}
                        onPointerDown={handleInputPointerDown}
                        onKeyDown={handleInputKeyDown}
                        onChange={(event) => {
                            if (shouldNavigateOnChange.current) {
                                navigateToPage(event.currentTarget.value, event.currentTarget.form ?? undefined);
                            }
                            shouldNavigateOnChange.current = false;
                        }}
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
                    to={`?page=${page + 1}`}
                    className={`${pageButtonClass} ${page === totalPages ? disabledPageButtonClass : ""}`}
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
